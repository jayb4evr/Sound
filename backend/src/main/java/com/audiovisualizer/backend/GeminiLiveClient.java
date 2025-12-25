package com.audiovisualizer.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

/**
 * Service class for interacting with Google Gemini API for audio transcription.
 * Handles streaming audio data to Gemini and receiving partial transcripts.
 */
@Service
public class GeminiLiveClient {

    private static final Logger logger = LoggerFactory.getLogger(GeminiLiveClient.class);

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.api-url}")
    private String apiUrl;

    private final WebClient webClient;

    public GeminiLiveClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Process audio chunks and return streaming transcripts from Gemini API.
     * 
     * @param audioChunk Binary audio data
     * @return Flux of partial transcript strings
     */
    public Flux<String> transcribeAudio(byte[] audioChunk) {
        // If API key is not configured, return simulated response
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("Gemini API key not configured. Returning simulated transcription.");
            return simulateTranscription(audioChunk);
        }

        try {
            // Convert audio bytes to base64 for API transmission
            String base64Audio = Base64.getEncoder().encodeToString(audioChunk);

            // Prepare request body for Gemini API
            Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                    Map.of(
                        "parts", new Object[]{
                            Map.of(
                                "inline_data", Map.of(
                                    "mime_type", "audio/webm",
                                    "data", base64Audio
                                )
                            ),
                            Map.of(
                                "text", "Transcribe this audio."
                            )
                        }
                    )
                },
                "generationConfig", Map.of(
                    "temperature", 0.1,
                    "maxOutputTokens", 256
                )
            );

            // Make streaming request to Gemini API
            return webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToFlux(String.class)
                .map(response -> {
                    logger.debug("Received response from Gemini: {}", response);
                    return parseTranscriptFromResponse(response);
                })
                .onErrorResume(error -> {
                    logger.error("Error calling Gemini API: {}", error.getMessage());
                    return Flux.just("[Transcription error: " + error.getMessage() + "] ");
                });

        } catch (Exception e) {
            logger.error("Exception in transcribeAudio: {}", e.getMessage(), e);
            return Flux.just("[Error processing audio] ");
        }
    }

    /**
     * Parse transcript text from Gemini API response.
     * 
     * @param response JSON response from Gemini
     * @return Extracted transcript text
     */
    private String parseTranscriptFromResponse(String response) {
        try {
            // Basic parsing - in production, use proper JSON parser
            if (response.contains("\"text\"")) {
                int start = response.indexOf("\"text\"") + 8;
                int end = response.indexOf("\"", start);
                if (end > start) {
                    return response.substring(start, end) + " ";
                }
            }
            return "";
        } catch (Exception e) {
            logger.error("Error parsing response: {}", e.getMessage());
            return "";
        }
    }

    /**
     * Simulate transcription when Gemini API is not available.
     * Returns simulated partial transcripts for demonstration purposes.
     * 
     * @param audioChunk Audio data (not used in simulation)
     * @return Flux of simulated transcript strings
     */
    private Flux<String> simulateTranscription(byte[] audioChunk) {
        String[] simulatedPhrases = {
            "Hello ",
            "this is ",
            "a simulated ",
            "transcription. ",
            "The audio visualizer ",
            "is working correctly. ",
            "Configure GEMINI_API_KEY ",
            "for real transcription. "
        };

        return Flux.range(0, simulatedPhrases.length)
            .delayElements(Duration.ofMillis(500))
            .map(i -> simulatedPhrases[i % simulatedPhrases.length])
            .take(3); // Return first 3 phrases per chunk
    }

    /**
     * Check if Gemini API is configured.
     * 
     * @return true if API key is available
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }
}
