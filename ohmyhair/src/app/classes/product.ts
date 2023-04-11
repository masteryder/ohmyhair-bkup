export class Product {
    nom_produit: string ;
    prix: number;
    quantite: number;
    id: number;
    categorie: number;
    rabais:number;
    supplement:number;
    commentaire:string;

    constructor(nom_produit: string, prix: number, quantite: number, id: number,categorie: number,rabais:number=0,supplement:number=0,commentaire:string=""){
        this.nom_produit = nom_produit;
        this.prix = prix;
        this.quantite = quantite;
        this.id = id;
        this.categorie=categorie;
        
        this.rabais=rabais;
        this.supplement=supplement;
        this.commentaire=commentaire;
    }

}