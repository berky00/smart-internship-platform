package com.smartintern.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartintern.model.Job;
import com.smartintern.model.Recommendation;
import com.smartintern.service.JobService;

@RestController
@RequestMapping("/api")
public class JobController {

    @Autowired
    private JobService jobService;

    // Tüm iş ilanlarını listelemek
    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Yeni iş ilanı oluşturmak
    @PostMapping("/jobs")
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    // Anahtar kelimeye göre iş ilanı aramak
    @GetMapping("/jobs/search/{keyword}")
    public List<Job> searchJobs(@PathVariable String keyword) {
        return jobService.findJobsByKeyword(keyword);
    }

    // CV'ye göre iş ilanı öner (GET versiyonu - query parametre ile)
    @GetMapping("/jobs/recommend")
    public List<Recommendation> recommendJobsViaQuery(@RequestParam String cv) {
        return jobService.recommendJobsForCv(cv);
    }

    // CV'ye göre iş ilanı öner (POST versiyonu - JSON body ile)
    @PostMapping("/jobs/recommend")
    public List<Recommendation> recommendJobsViaJson(@RequestBody Map<String, String> request) {
        String cvText = request.get("cv");
        return jobService.recommendJobsForCv(cvText);
    }

    // ✅ Kullanıcı ID'si ile iş önerisi (cvText üzerinden)
    @GetMapping("/jobs/recommend/{userId}")
    public List<Recommendation> recommendJobsByUserId(@PathVariable Long userId) {
        return jobService.recommendJobsForUserId(userId);
    }
}
