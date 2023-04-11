import { Service } from "app/classes/service";
import { Product } from "app/classes/product";

export class ServiceClient {
    services: Service[];
    produits: Product[];
    id_client: number;
    timestamp: Date;
    rabais:number;
    supplement:number;
    paye_cash:boolean;
    commentaire:string;
    id: number;

    constructor(id: number, id_client: number, timestamp: Date, rabais:number,supplement:number,paye_cash:boolean,commentaire:string,services:Service[],produits:Product[]){
        this.id_client = id_client;
        this.timestamp = timestamp;
        this.rabais = rabais;
        this.supplement = supplement;
        this.paye_cash = paye_cash;
        this.commentaire = commentaire;
        this.services=services;
        this.produits=produits;
        this.id = id;
    }
}