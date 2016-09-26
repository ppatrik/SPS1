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

## Apache VirtualHost

VirtualHost používame ak jeden počítač má pridelených viac doménových mien. VirtualHost vieme nastaviť tak aby každé doménové meno zobrazilo iný obsah. Okrem domenovych mien mozeme virtualhost použiť aj na rozne porty. Často sa na serveroch používa virtualhost pre port 443, ktorý predstavuje šifrované spojenie so serverom a teda má odlišnú konfiguráciu ako bežný virtualhost pre port 80.

> Pripravte si vo svojom domovskom priečinku */home/apache* 2 priečinky. 1 pre domenove meno *patrik.apache* a druhy *pekarcik.apache*. Obsahom priečinku nech su 2 rozne subory index.html

Vytvoríme konfiguračný súbor v priečinku `/etc/apahce2/sites-available` s nazvom patrik-apache.conf. A vložíme do neho tento obsah (s vysvetlivkami)

```
# Server nech počúva na tomto porte
Listen 80
#Vytvoríme virtualhost ktorý počúva na všetkých sieťových interfacoch
<VirtualHost *:80>
    # domenove meno/á na ktoré ma server zobrazit obsah tohto virtualhosta
    ServerName patrik.apache
    ServerAlias patrik.apache
    #ServerAlias dalsi.alias
    
    # Kontakt na administrátora virtualhostu
    ServerAdmin patrik.pekarcik@upjs.sk
    
    DocumentRoot "/home/apache/patrik-apache"
    
    # Nastavenie priečinku aby bol pre užívateľov prístupný
    <Directory "/home/apache/patrik-apache">
        # Povolenie podla apache 2.2
        Order deny,allow
        Allow from all
        # Povolenie podla apache 2.4
        Require all granted
        # Povolenie upravovacích skritov .htaccess
        AllowOverride All
        # Rozsierene moznosti priecinka (-Indexes - listovanie suborov v nom je zakazane)
        Options -Indexes
    </Directory>
</VirtualHost>
```

> Po tomto nastavení už samostatne vytvorte virtualhost pre druhy priecinok

## Proxy

Pri inštaláciách, ktoré nemajú verejnú ip adresu, pri používaní load balancingu alebo na zabezpecenie aplikačných serverov sa používa proxy. 

![obrazok](https://adolfomaltez.files.wordpress.com/2011/05/apache-reverse-proxy.png)

> **mod_proxy** je potrebne aktivovať `sudo a2enmod proxy` a `sudo a2enmod proxy_http`

Nastavenie proxy je podobné ako pri virtualhost. pre poxy nepotrebujeme nastavenia pre `<Directory>` pretože nastavíme proxy presmerovania. Subor pre virtualhost vyzera nasledovne

```
# Server nech počúva na tomto porte
Listen 80
#Vytvoríme virtualhost ktorý počúva na všetkých sieťových interfacoch
<VirtualHost *:80>
    # domenove meno/á na ktoré ma server zobrazit obsah tohto virtualhosta
    ServerName patrik.apache
    ServerAlias patrik.apache
    #ServerAlias dalsi.alias
    
    # Kontakt na administrátora virtualhostu
    ServerAdmin patrik.pekarcik@upjs.sk
    
    ProxyPreserveHost On
    ProxyPass / http://www.upjs.sk/
    ProxyPassReverse / http://www.upjs.sk/

</VirtualHost>
```

## Rewrite

Moderné webstránky dnes už používajú rôzne atraktívne URL adresy k obsahu. V apache serveri pomocou modulu rewrite vieme ľubovoľne meniť obsah adresy a prepisovať ho tak aby sme sa dostali ku žiadanému obsahu.

> **mod_rewrite** je potrebne aktivovať `sudo a2enmod rewrite`

Vo virtualhost vyuzivame nasledovne nastavenia pre proxy

- **RewriteEngine on** - Nastavíme zapnutie modu rewrite pre aktualny virtualhost
- **RewriteBase "/directory/"** - Priecinok od ktoreho je povoleny rewrite
- **RewriteRule "/widget/(.*)$" "http://product.example.com/widget/$1" [FLAGS]** - Rewrite pravidla
- [ďalšie pravidlá v oficiálnej dokumentácíí](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html)

Ukážka použitia pre zmennu nacitavaneho suboru index.html na main.html
```
RewriteEngine on
RewriteRule "^index.html$" "main.html" [L]
```

## Úlohy

### 1. Pomocou mod rewrite a mod_proxy urobte virtualhost ktory bude cez linuxovy server presmerovavat obsah zadaneho webu za adresou

Príklad http://192.168.56.10/www.upjs.sk/ zobrazí stránku nasej skoly

### 2. Nastavte Virtualhost na porte 8080 a zobrazte tam pomocou proxy obsah svojej študentskej webstránky.

Ak nemate osobnu stranku zvolte stranku spoluziaka.
