# APACHE PROXY A VIRTUALHOST

## Úvod

### Príprava prostredia

Stiahnite si image virtuálneho počítača (link). 

> Image obsahuje čistú inštaláciu Ubuntu Server 16.04 s nastavenými sietovými adaptémi NAT a HOST-ONLY.

Údaje počítača
 - ip: 192.168.56.101 (ziskana cez HOST-ONLY dhcp server, pri rozsirenej konfiguracii moze byt ina)
 - meno: apache
 - heslo: spsapache
 
### Inštalácia apache servera

Distribúcia linuxu ubuntu používa balíčkovací nástroj apt. Pre inštaláciu preto zadáme príkaz

```
sudo apt install apache2
```

> **Čo je to Apache server?**
> Apache je robustný webový server tvorený ako open source. Apache server je bezne využívaný pri mnohých webových stránkach. Na slovensku ho používajú všetky webhostingové spoločnosti. Vznikol v roku 1995 a dnes uz používame jeho verziu 2.4.

----

> **Doménové meno počítača**
> Je meno ktorým nazývame počítače, napr. [www.upjs.sk](www.upjs.sk) alebo [ics.upjs.sk](ics.upjs.sk). (viac o doménových menách a DNS [tu](https://siete.gursky.sk/Prednasky/Prednaska03))

### Konfigurácia apache

Balíček apache2 v distribúcii ubuntu obsahuje upravenú štruktúru konfguračných súborov ako je to v samotnom serveri apache2. 
Všetky konfiguračné veci nájdeme v priečinku **/etc/apache2/**. Je rozdelený do logických celkov mods, conf a sites.
Každý z logických celkov mods, conf a sites obsahuje 2 priečinky. **X-available** je priečinok kde mozeme konfigurovat rozne 
stranky, moduly a **x-enabled** je priečinok, v ktorom sú iba symbolické odkazy na konfiguráky v priečinku **x-available**.

```
/etc/apache2/
|-- apache2.conf
|       `--  ports.conf
|-- mods-enabled
|       |-- *.load
|       `-- *.conf
|-- mods-available
|       |-- *.load
|       `-- *.conf
|-- conf-enabled
|       `-- *.conf
|-- conf-available
|       `-- *.conf
|-- sites-enabled
|       `-- *.conf
|-- sites-available
|       `-- *.conf
```

#### Mods

Apache je modulárny systém, ktorý vieme rožširovať o ľubovolné existujúce moduly. Bežne používaným modulom je *apache2-mod-php5* 
pre použitie PHP skriptov alebo dnes už často používaný mod_rewrite na prepisovanie url adries, ktoré hovoria o obsahu viac ako 
číselný identifikátor stránky.

Moduly pre apache povolujeme a blokujeme nasledovnými príkazmi.
```
sudo a2enmod rewrite
sudo a2dismod rewrite
```

#### Sites

Server v základnom nastavení poskytuje zobrazenie jednej webstránky pri volaní servera. To by ale nebolo relevantné pri jednoduchých prezentáciách. Preto apache server podporuje **VirtualHost**, pomocou tohto vieme na jednej fyzickej inštalácii apache servera vytvorit neobmmedzene mnozstvo webstránok. Každú webstránku si pomenujeme pomocou doménového mena a konfiguráciu ulozíme do samostatného súboru v priecinku sites-available.

Stránky povolujeme a vypiname nasledovne
```
sudo a2ensite mojweb
sudo a2dissite mojweb
```

## Špecialne nastavenie DNS servra lokálneho počítača

Pred tým ako zacneme prihlásením do linuxového servera kde príkazom `ifconfig` získame jeho IP adresu. Následne na našom (desktop) počítači nastavíme niekoľko doménových mien pre linuxový server (ked domenove meno dame do priehliadača tak DNS nás presmeruje na linuxový server).

Nájdeme na počítači súbor **hosts**. Zvyčajne sa nachádza tu:
- Windows `C:\Windows\System32\drivers\etc\hosts`
- Linux `/etc/hosts`

Tento súbor obsahuje v každom riadku jeden pár doménového mena a ip-adresy kam má doménové meno smerovať.

Pridajme na koniec súboru takéto nastavenie (kde za ip adresu zadajte ip-cku vaseho linuxového servera)

```
192.168.56.101	patrik.apache
192.168.56.101	pekarcik.apache
```


## Úlohy

### 1. POMOCOU MOD REWRITE A MOD_PROXY UROBTE VIRTUALHOST KTORY BUDE CEZ VAS POCITAC PRESMEROVAVAT OBSAH LUBOVOLNEHO WEBU

Príklad http://192.168.56.10/www.upjs.sk/ zobrazí stránku nasej skoly

### 2. NASTAVTE VIRTUALHOST NA PORTE 8080 ZOBRAZUJUCI OBSAH SKOLSKEJ OSOBNEJ STRANKY

Ak nemate osobnu stranku zvolte stranku spoluziaka.
