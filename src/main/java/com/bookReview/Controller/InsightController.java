package com.bookReview.Controller;

import com.bookReview.dto.LibraryInsightsDto;
import com.bookReview.Service.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightController {

    private final InsightService insightService;

    @GetMapping("/library")
    public ResponseEntity<LibraryInsightsDto> getLibraryInsights() {
        return ResponseEntity.ok(insightService.getLibraryInsights());
    }
}
