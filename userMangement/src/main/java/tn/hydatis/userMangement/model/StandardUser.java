package tn.hydatis.userMangement.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@MappedSuperclass
public class StandardUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(name = "prénom")
    private String prenom;
    
    private String email;

    private String password;

    @Column(name = "date_de_naissance")
    private LocalDate dateDeNaissance;

    @Column(name = "numero_téléphone")
    private String numeroTelephone;

    @Lob
    @Column(name = "photo", nullable = false)
    private byte[] photo;
}
