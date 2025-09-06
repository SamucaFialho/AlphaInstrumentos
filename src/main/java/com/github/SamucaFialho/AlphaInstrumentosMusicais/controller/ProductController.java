package com.github.SamucaFialho.AlphaInstrumentosMusicais.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.ProductRequestCreate;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.ProductResponse;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.services.ProductService;



@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService service;


    @GetMapping
    public List<Product> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@RequestBody ProductRequestCreate dto) {
        return ResponseEntity.status(201).body(new ProductResponse().toDto(service.createProduct(dto)));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

