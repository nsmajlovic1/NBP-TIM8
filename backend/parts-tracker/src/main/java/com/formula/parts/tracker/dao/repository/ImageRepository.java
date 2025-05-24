package com.formula.parts.tracker.dao.repository;

import com.formula.parts.tracker.dao.model.Image;
import com.formula.parts.tracker.dao.model.ImageFields;
import com.formula.parts.tracker.dao.model.Storage;
import com.formula.parts.tracker.shared.exception.DatabaseException;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ImageRepository extends BaseRepository<Image> {

    public ImageRepository(DataSource dataSource) {
        super(dataSource);
    }

    public Image persist(Image image) {
        final String query = """
            INSERT INTO NBP02.IMAGE (
                ID,
                ASSIGN_ID,
                ASSIGN_TYPE,
                DATA,
                EXTENSION
            )
            VALUES (NBP02."ISEQ$$_301235".NEXTVAL, ?, ?, ?, ?)
        """;

        executeInsertQuery(query, image.getAssignId(), image.getAssignType(), image.getData(), image.getExtension());

        final String selectQuery = "SELECT * FROM NBP02.IMAGE ORDER BY ID DESC FETCH FIRST 1 ROWS ONLY";
        return executeSingleSelectQuery(selectQuery, this::mapToEntity);
    }

    public Image findByAssign(Long assignId, String assignType) {
        final String query = "SELECT * FROM NBP02.IMAGE WHERE ASSIGN_ID = ? AND ASSIGN_TYPE = ?";
        return executeSingleSelectQuery(query, this::mapToEntity, assignId, assignType);
    }

    public List<Image> findAllByAssign(Long assignId, String assignType) {
        final String query = """
            SELECT * FROM NBP02.IMAGE
            WHERE ASSIGN_ID = ? AND ASSIGN_TYPE = ?
            ORDER BY ID DESC
        """;
        return executeListSelectQuery(query, this::mapToEntity, assignId, assignType);
    }

    public Image findById(Long id) {
        final String query = "SELECT * FROM IMAGE WHERE ID = ?";
        return executeSingleSelectQuery(query, this::mapToEntity, id);
    }

    public boolean existsById(long id) {
        final String query = """
            SELECT COUNT(*) FROM NBP02.IMAGE WHERE ID = ?
        """;

        return executeExistsQuery(query, id);
    }

    public void deleteById(long id) {
        final String query = """
            DELETE FROM NBP02.IMAGE WHERE ID = ?
        """;

        executeUpdateQuery(query, id);
    }

    private Image mapToEntity(ResultSet rs) {
        try {
            Image img = new Image();
            img.setId(rs.getLong(ImageFields.ID));
            img.setAssignId(rs.getLong(ImageFields.ASSIGN_ID));
            img.setAssignType(rs.getString(ImageFields.ASSIGN_TYPE));
            img.setData(rs.getBytes(ImageFields.DATA));
            img.setExtension(rs.getString(ImageFields.EXTENSION));
            return img;
        } catch (SQLException e) {
            throw new DatabaseException();
        }
    }
}
