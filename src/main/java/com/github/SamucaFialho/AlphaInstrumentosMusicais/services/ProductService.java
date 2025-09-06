package com.github.SamucaFialho.AlphaInstrumentosMusicais.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.dto.ProductRequestCreate;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
     private ProductRepository repository;

    public Product createProduct(ProductRequestCreate dto) {
        return repository.save(dto.toModel());
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
    

