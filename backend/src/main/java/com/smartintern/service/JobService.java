package com.smartintern.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.smartintern.model.Job;
import com.smartintern.model.Recommendation;
import com.smartintern.model.User;
import com.smartintern.repository.JobRepository;
import com.smartintern.repository.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final WebClient webClient;

    @Autowired
    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.webClient = WebClient.builder()
                .baseUrl("http://127.0.0.1:5001")
                .build();
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> findJobsByKeyword(String keyword) {
        return jobRepository.findAll()
                .stream()
                .filter(job -> job.getTitle().toLowerCase().contains(keyword.toLowerCase())
                        || job.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .toList();
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Recommendation> recommendJobsForCv(String cvText) {
        List<String> descriptions = jobRepository.findAll()
                .stream()
                .map(Job::getDescription)
                .toList();

        if (descriptions.isEmpty()) {
            throw new RuntimeException("Veritabanında hiç iş ilanı yok. Lütfen önce ilan ekleyin.");
        }

        try {
            Mono<Recommendation[]> mono = webClient.post()
                    .uri("/match")
                    .bodyValue(Map.of("cv", cvText, "jobs", descriptions))
                    .retrieve()
                    .bodyToMono(Recommendation[].class);

            Recommendation[] recs = mono.block();
            return recs != null ? List.of(recs) : List.of();
        } catch (WebClientResponseException e) {
            System.err.println("Flask servisi hatası: " + e.getResponseBodyAsString());
            throw new RuntimeException("Flask servisinden geçerli bir cevap alınamadı: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Bilinmeyen hata: " + e.getMessage());
            throw new RuntimeException("İşlem sırasında bir hata oluştu: " + e.getMessage());
        }
    }

    // ✅ Kullanıcı ID’sine göre CV metninden iş önerisi (cvText yoksa boş liste döndürür)
    public List<Recommendation> recommendJobsForUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Belirtilen ID ile kullanıcı bulunamadı: " + userId));

        String cvText = user.getCvText();
        if (cvText == null || cvText.isBlank()) {
            System.err.println("Uyarı: Kullanıcının kayıtlı bir CV metni bulunamadı.");
            return List.of(); // ❗ Hata vermek yerine boş liste döndür
        }

        return recommendJobsForCv(cvText);
    }
}
