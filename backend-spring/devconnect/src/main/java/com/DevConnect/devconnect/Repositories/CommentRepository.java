package com.DevConnect.devconnect.Repositories;

import com.DevConnect.devconnect.Models.CommentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentModel, Long> {
    // You can add custom query methods here if needed
}
