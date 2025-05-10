package com.smartintern.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Recommendation {
    @JsonProperty("job_index")
    private int jobIndex;

    private String description;
    private double score;

    @JsonProperty("match_level")
    private String matchLevel;

    public Recommendation() {}

    public Recommendation(int jobIndex, String description, double score, String matchLevel) {
        this.jobIndex = jobIndex;
        this.description = description;
        this.score = score;
        this.matchLevel = matchLevel;
    }

    public int getJobIndex() {
        return jobIndex;
    }

    public void setJobIndex(int jobIndex) {
        this.jobIndex = jobIndex;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getMatchLevel() {
        return matchLevel;
    }

    public void setMatchLevel(String matchLevel) {
        this.matchLevel = matchLevel;
    }
}
