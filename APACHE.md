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

....

Stránky povolujeme a vypiname nasledovne
```
sudo a2ensite mojweb
sudo a2dissite mojweb
```

