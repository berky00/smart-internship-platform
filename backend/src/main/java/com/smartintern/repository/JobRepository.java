package com.smartintern.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartintern.model.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // JpaRepository sayesinde CRUD işlemleri hazır geliyor.
}
