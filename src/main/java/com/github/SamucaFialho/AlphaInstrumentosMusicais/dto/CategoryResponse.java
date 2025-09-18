package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Category;

public class CategoryResponse {

    private Long id;
    private String nome;

    public CategoryResponse toDto(Category category){ {
        this.setId(category.getId());
        this.setNome(category.getNome());
        return this;
    }
}

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    
}

