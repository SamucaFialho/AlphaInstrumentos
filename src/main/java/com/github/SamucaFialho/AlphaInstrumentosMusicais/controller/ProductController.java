package com.github.SamucaFialho.AlphaInstrumentosMusicais.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.ProductRequestCreate;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.ProductResponse;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.repository.ProductRepository;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.services.ProductService;



@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService service;

    @Autowired
    private ProductRepository productRepository;


    @GetMapping
public List<ProductResponse> getAll() {
    return service.findAll().stream()
                 .map(p -> new ProductResponse().toDto(p))
                 .collect(Collectors.toList());
}


    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(p -> ResponseEntity.ok(new ProductResponse().toDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

     @PostMapping("/{id}/decreaseStock")
    public ResponseEntity<String> decreaseStock(@PathVariable Long id, @RequestParam Integer quantidade) {
        return productRepository.findById(id).map(product -> {
            if (product.getQuantidade() < quantidade) {
                return ResponseEntity.badRequest().body("Estoque insuficiente");
            }
            product.setQuantidade(product.getQuantidade() - quantidade);
            productRepository.save(product);
            return ResponseEntity.ok("Estoque atualizado");
        }).orElse(ResponseEntity.notFound().build());
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

