package com.github.SamucaFialho.AlphaInstrumentosMusicais.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.repository.ProductRepository;

@Service
public class ProductService {

     private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
    

