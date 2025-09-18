package com.github.SamucaFialho.AlphaInstrumentosMusicais.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.CategoryRequestCreate;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Category;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category createCategory(CategoryRequestCreate dto) {
        return categoryRepository.save(dto.toModel());
    }
}
