//period of a project
export class PlainService {
    id: number;
    nom_service: string ;
    prix: number;
    longueur: number; //0=undefined, 1=court, 2=mi-long, 3=long
    sexe: number; //0=undefined, 1=homme, 2=femme
    enfant: boolean; //0=adulte, 1=enfant

    constructor(nom_service: string, prix: number, longueur: number, id: number,sexe: number,enfant:boolean,rabais:number=0,supplement:number=0,commentaire:string=""){
        this.nom_service = nom_service;
        this.prix = prix;
        this.longueur = longueur;
        this.id = id;
        this.sexe=sexe;
        this.enfant=enfant;
    }


}