package com.DevConnect.devconnect.Repositories;

import com.DevConnect.devconnect.Models.CommentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface CommentRepository extends JpaRepository<CommentModel, Long> {
    List<CommentModel>  findByOwnerId(Long ownerId);
}
