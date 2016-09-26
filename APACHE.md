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
> ........

> **Doménové meno počítača**
> ......

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
