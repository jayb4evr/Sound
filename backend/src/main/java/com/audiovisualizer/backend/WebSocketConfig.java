package com.audiovisualizer.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket configuration for handling audio streaming.
 * Maps /audio endpoint to handle binary audio messages and stream transcripts.
 */
@Configuration
public class WebSocketConfig {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    private final GeminiLiveClient geminiLiveClient;

    public WebSocketConfig(GeminiLiveClient geminiLiveClient) {
        this.geminiLiveClient = geminiLiveClient;
    }

    /**
     * WebSocket handler for /audio endpoint.
     * Receives binary audio chunks and sends back transcript responses.
     */
    @Bean
    public WebSocketHandler audioWebSocketHandler() {
        return session -> {
            logger.info("WebSocket connection established: {}", session.getId());

            // Handle incoming binary messages (audio chunks)
            Flux<String> transcriptFlux = session.receive()
                .doOnNext(message -> logger.debug("Received WebSocket message type: {}", message.getType()))
                .filter(message -> message.getType() == WebSocketMessage.Type.BINARY)
                .map(message -> {
                    // Extract binary audio data
                    ByteBuffer payload = message.getPayload().asByteBuffer();
                    byte[] audioData = new byte[payload.remaining()];
                    payload.get(audioData);
                    logger.debug("Received audio chunk: {} bytes", audioData.length);
                    return audioData;
                })
                .flatMap(audioData -> {
                    // Send audio to Gemini API and get transcript
                    return geminiLiveClient.transcribeAudio(audioData)
                        .onErrorResume(error -> {
                            logger.error("Error in transcription: {}", error.getMessage());
                            return Flux.just("[Error: " + error.getMessage() + "] ");
                        });
                })
                .doOnNext(transcript -> logger.debug("Sending transcript: {}", transcript))
                .doOnError(error -> logger.error("Error in WebSocket handler: {}", error.getMessage()))
                .doOnComplete(() -> logger.info("WebSocket stream completed"))
                .onErrorResume(error -> {
                    logger.error("Fatal error in WebSocket: {}", error.getMessage(), error);
                    return Flux.empty();
                });

            // Send transcript messages back to client
            return session.send(
                transcriptFlux.map(session::textMessage)
            ).doOnError(error -> logger.error("Error sending messages: {}", error.getMessage()))
            .then()
            .doFinally(signalType -> logger.info("WebSocket connection closed: {} ({})", 
                session.getId(), signalType));
        };
    }

    /**
     * Map WebSocket handlers to URL paths.
     */
    @Bean
    public HandlerMapping webSocketHandlerMapping() {
        Map<String, WebSocketHandler> map = new HashMap<>();
        map.put("/audio", audioWebSocketHandler());

        SimpleUrlHandlerMapping handlerMapping = new SimpleUrlHandlerMapping();
        handlerMapping.setOrder(1);
        handlerMapping.setUrlMap(map);
        return handlerMapping;
    }

    /**
     * WebSocket handler adapter for reactive WebSocket support.
     */
    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }
}
