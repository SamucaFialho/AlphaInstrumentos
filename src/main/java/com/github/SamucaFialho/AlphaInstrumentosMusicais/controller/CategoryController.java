package com.github.SamucaFialho.AlphaInstrumentosMusicais.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.CategoryRequestCreate;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.CategoryResponse;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Category;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.repository.CategoryRepository;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.services.CategoryService;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryRepository repository;

    @Autowired
    private CategoryService service;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequestCreate dto) {
        return ResponseEntity.status(201).body(new CategoryResponse().toDto(service.createCategory(dto)));
    }

    @GetMapping
    public List<Category> list() {
        return repository.findAll();
    }
}