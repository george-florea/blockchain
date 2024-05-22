# Doc proiect blockchain

## cerinte proiect:
![image](https://github.com/jovialjoker/elonMusk/assets/43217153/12c76954-e90f-46ee-809c-cc545eedbb91)

> (optional)
> pentru a prezenta si flow-ul de conectare cu metamask, in caz ca v-ati conectat deja, puteti sa
> - apasati f12 in site
> - mergeti in meniul de application:
>   ![image](https://github.com/jovialjoker/elonMusk/assets/43217153/b2ad22b0-9f35-485b-90b7-ef4e492db887)
> - stergeti `isAuth` (selectati si apasati *delete*)
>
##   (obligatoriu)
>   de creeat 2 conturi in metamask pentru a demonstra functia de owner si de bidder intr-o licitatie

## Pasi prezentare aplicatie:

1.  De pe pagina de home apasati ori pe butonul central de *go to auctions* ori pe *auctions* din meniul de navigare
![image](https://github.com/jovialjoker/elonMusk/assets/43217153/aead8aa9-a7c7-441b-b57f-3b98e6ea2698)

2. Apasam pe butonul de *add object*
![image](https://github.com/jovialjoker/elonMusk/assets/43217153/97c03c7e-2c8a-4912-a5e4-6a977d1b15b2)

3. Pe pagina de adaugare vom insera date, apoi cand apasam pe butonul de auction me ne va aparea o analiza de cost, daca alegem sa continuam se va deschide fereastra de metamask, in care vom puteam confirma tranzactia
   
5. O data ce tranzactia a fost adaugata, o putem vedea si in lista de licitatii:![image](https://github.com/jovialjoker/elonMusk/assets/43217153/dfebd7c7-c0f7-49a8-8d0e-5bc842c13f73)
   
6. Pe pagina de detalii
   - vom schimba contul pentru a putea licita
   - licitam (a se observa ca apare suma licitata cu minus)
   - schimbam contul din nou, in cel de owner
   - dam cancel la licitatie drept owner
   - schimbam din nou contul in cel care a licitat
  
7. Din meniul de navigare, apasam pe My auctions
8. Alegem licitatia la care tocmai ce am licitat si dam finalize auction pentru a ne retrage banii( in fereastra de metamask ar trb sa apara suma licitata cu +)


## Structura proiectului de react:

### src/context:
1. contine cele 2 abi-uri ale contractelor in fisiere .json
2. in useWeb3.jsx:
   - se creeaza un provider de context: initializam un state global, un fel de singleton, pentru a ne asiguram ca avem aceleasi date in toate paginile, nu avem instante diferite
   - in functia de initWeb3(![image](https://github.com/jovialjoker/elonMusk/assets/43217153/4e2783f1-340d-4ea8-a966-0339da442a6f))
       - verificam daca matamask a fost conectat: daca pe window se afla obiectul *ethereum*
       - daca da, instantiem o instanta de web 3 prin care avem acces la informatii despre blockchain si despre conturile conectate la metamask
        ![image](https://github.com/jovialjoker/elonMusk/assets/43217153/80d481fc-09bd-4d89-bd91-99e038151d6c)
       - instantiem si contractul de auctionCreator folosind adresa deployata pe remix si abi-ul asociat
       - printr-un call la metoda getAuctions primim adresele licitatiilor existente, prin care vom itera si vom instantia contracte pentru fiecare din ele:![image](https://github.com/jovialjoker/elonMusk/assets/43217153/30a1c6ec-8121-461c-8e8d-f6eee7d0ec78)
       - obiectul final in care sunt salvate contractele va arata cv de genu:
        > {
        > auctionCreator: , 
        > auctions: { 
        >  [id_auction]: contract-ul asociat licitatiei cu id-ul dat 
        >  }, 
        >}
  - acesta functie( useWeb3() ) este folosita in pagini drept:
![image](https://github.com/jovialjoker/elonMusk/assets/43217153/dbb6744e-97af-40f8-9138-87e2a15288a4)

### src/Pages
- fiecare folder este asignat unei parti de aplicatie: Home, MyAuctions, Auctions
- fisierele .jsx sunt asociate unei pagini

## stocarea pozelor se face pe firebase deoarece am incercat sa stochez pozele pe ipfs, dar:
1. pe infura, un site care ofera servicii de hostare a ipfs, nu mai acorda api key-uri pentru interactiunea cu ipfs pentru utilizatorii noi
2. pentru a hosta local ipfs, trebuie platita o suma de bani si nu am considerat ca merita

## Cerinte optionale:
1. Tratare events:
   - in folderul src/Pages/Auctions/observables, in fisierul AuctionObserver.js:
     ![image](https://github.com/jovialjoker/elonMusk/assets/43217153/09e2f010-4474-4469-b7f4-0917eade310a)
   - se asculta dupa eventul BidPlaced, iar de fiecare data cand este emis acest event in contract, se va apela functia data ca parametru(**callback** este un pointer catre functia data ca parametru):
![image](https://github.com/jovialjoker/elonMusk/assets/43217153/3bff8189-52ee-437f-9eed-0dddd891fe61)
   - functia subscribeToBidPlaced este folosita in fisierul src/Pages/Auctions/ViewAuction.jsx. Functia data ca parametru ( getAuctionDetails ) returneaza detaiile actualizate ale licitatiei 
  ![image](https://github.com/jovialjoker/elonMusk/assets/43217153/25a47162-8d78-443f-bbd9-57e76c11e078)
  - astfel de ficare data cand este emis eventul de bidPlaced, se va face un nou request care va aduce datele actualizate in pagina

2. Analiza gas-cost
   - se gaseste in fiserul src/Pages/Auctions/AddAuction.jsx
   - explicatia se gaseste aici: [explicatie gpt](https://chatgpt.com/share/0afb06dd-36ea-40a8-a682-a2f918ea423c)
   - aceasta analiza se apeleaza automat de fiecare data cand dorim sa adaugam o noua licitatie, doar daca utilizatorul vrea sa continue tranzactia se va realiza
  
3. Control al starii tranzactiilor
   - am folosit un loading spinner si toast-uri pentru a oferi feedback despre starea tranzactiilor
   - prin try catch putem observa daca o tranzactie s-a realizat cu succes sau nu si afisam utilizatorului mesajul potrivit in toast
   ![image](https://github.com/jovialjoker/elonMusk/assets/43217153/ffd2873f-707e-4967-8130-e9f4161bcadb)
   -exemplu toast: ![image](https://github.com/jovialjoker/elonMusk/assets/43217153/481a22b6-0872-4037-96e3-4aedf02063f8)

