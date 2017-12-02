# Apache Server

V tomto návode si úkážeme ako na linuxovej platforme (konkrétne distribúcii ubuntu 16.04) nainštalovať webový server. Povieme si kde sa nachádzajú konfiguračné súbory, a ktoré na čo slúžia. Inštaláciu modulov do webového servera a interpretera si ukážeme nasadením CMS systému GRAV.

## Inštalácia webového servera Apache 2.4

Apache server sa nachádza priamo v štandardných balíčkoch ubuntu linuxu.

```sh
sudo apt install apache2
```

Po dokončení inštalácii môžeme vyskúšať prístup na server vložením tejto adresy do prehliadača **http://<ip-servera>/**. Mali by sme dostať úvodnú stránku apache servera.

## Inštalácia interpretera PHP

Budeme inštalovať PHP verzie 7.0, ktorá je taktiež súčasťou štandartných balíčkov ubuntu linuxu. Na rozdiel od webového servera balíček obsahuje v názve aj verziu. Je to z dôvodu, že na jednom počítači môžeme mať nainštalovaných viac verzií PHP interpretera.

```sh
sudo apt install php7.0
```

Skontrolujeme či inštalácia prebehla úspešne

```sh
php -v
```

Ak chceme PHP používať webovým serverom, tak potrebujeme nakonfigurovať tento server. V ubuntu linuxe postačuje nainštalovať apache modul mod-php7.0, ktorý konfiguráciu urobí za nás

```sh
sudo apt install libapache2-mod-php7.0
```

Pre otestovanie konfigurácie si vytvoríme php súbor **phpinfo.php** v priečinku **/var/www/html/**

```sh
sudo nano /var/www/html/phpinfo.php
```

s nasledovným obsahom

```php
<?php phpinfo();
```

Otestujeme úspešnosť inštalácie otvorením nasledovnej url v prehliadači **http://<ip-adresa>/phpinfo.php**.

> Pokiaľ chceme zverejniť len jednoduchú stránku, tak ju môžeme umiestniť do priečinka **/var/www/html/** a bude nám fungovať bez ďalších pokročilých konfigurácií.

## Infomácie o konfigurácii apache servera

Implementacia webového servera v ubuntu linuxe obsahuje veľmi dobre spracovanú úvodnu stránku (umiestnenú v priečinku **/var/www/html/**). 

Konfiguracia apache servera je umiestnená v priečinku **/etc/apache2/**. Je rozdelená do viacerých menších celkov umiestnených v priečinkoch **mods**, **sites**, **conf**. Tieto priečinky sú vždy v páre enabled a available. Rozdelenie na *-available a *-enabled je dobré ak pripravujeme konfigurácie, ktoré sú alebo nie sú aktuálne povolené pre apache. 

* *-available slúži na uloženie možných konfigurácií pre apache server.
* *-enabled obsahuje symbolické linky na konfiguračné subory v *-availabe. Tieto konfigurácie sú použité pri štartovani apache servera.

Administrátor servera do priečinka enabled nemusí vytvárať symbolicé linky ručne. Vývojári ubuntu linuxu mu pripravili niekoľko pomocných nástrojoch, ktoré ich budú spravovať a hneď vykonajú reload, reštart apache servera. Tieto nástroje sú a2enmod, a2dismod, a2ensite, a2dissite, and a2enconf, a2disconf.

Pre manuálne reštartovanie apache servera používame nasl. príkaz

```sh
sudo systemctl restart apache2
```

## Nastavenia PHP

PHP konfigurácie sú v priečinku **/etc/php**. Ako som spomínal je možné mať viac verzií PHP naraz a preto je konfigurácia pre každú verziu zvlášť. V priečinku **/etc/php/7.0/** máme konfiguráciu pre aktuálnu inštaláciu. Tento priečinok je ďalej rozdelený podľa využitia php na cli, apache2.

* cli - spúšťanie interpretera pomocou command line interface
* apache2 - spracovanie php súborov webovým serverom apache

Pre spoločné konfigurácie slúži priečinok **mods-available**. Pre povolenie konfigurácií v tomto priečinku máme pomocné príkazy (tak ako to bolo pre apache) phpenmod, phpdismod. Tieto príkazy nám povolia/zakážu konfiguráciu pre všetky využitia php (apache2, cli).

# Inštalácia aplikácie grav

Základná inštalácia PHP a APACHE2 je dokončená, a máme informácie ako a kde ich konfigurovať. Poďme si nainštalovať bezdatabázový CMS systém Grav (https://getgrav.org/) a dokončiť konfiguráciu podľa požiadaviek vybraného CMS systému.

Na stránke (https://getgrav.org/) si nájdeme aktuálnu verziu s administráciou a stiahneme ju v domovskom adresári servera:

```sh
wget https://getgrav.org/download/core/grav-admin/1.3.8
mv 1.3.8 grav-admin-v1.3.8.zip
```

Stiahli sme zip archív, ktorý rozbalíme, a presunieme do priečinka **/var/www/grav/**

```sh
# potrebujeme rozbaliť zip archív
sudo apt install unzip
# rozbalenie
unzip grav-admin-v1.3.8.zip
# presun rozbalenej aplikácie na zvolené miesto
sudo mv grav-admin/ /var/www/grav/
# nastavenie prístupových práv pre apache server
sudo chown www-data. /var/www/grav/ -R
```

Takto presunutá stránka sa nám po zadaní ip adresy ešte nezobrazí, ale po vytvorení konfiguácie v priešinku **sites-available** a jej povolení sa nám podarí pristúpiť k nej.

```sh
cd /etc/apache2/sites-available/
sudo cp 000-default.conf 001-grav.conf
```

Súbor **001-grav.conf** nastavíme nasledovne. POZOR je potrebné odstrániť komentáre.

```
<VirtualHost *:80>
        ServerName grav # url adresa pre stranku
        ServerAlias grav.stranka # alternativna url adresa

        ServerAdmin webmaster@localhost # email administratora
        DocumentRoot /var/www/grav # umiestnenie stranky na disku

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        <Directory /var/www/grav> # nastavenie priecinka pre virtualhost
        	Require all granted # povolenie pristupu pre virtualhost do priecinka
        	AllowOverride all # povolenie konfiguracnych suborov .htaccess (povolenie aplikacii lubovolne nastavovat php/apache dynamicke premenne)
        </Directory>
</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```

Zapnutie vytvorenej konfigurácie

```sh
sudo a2ensite 001-grav.conf
sudo a2dissite 000-default.conf ## kedze nemame nastavene dns smerovania vypneme hlavny virtualhost
sudo systemctl restart apache2
```

Teraz už máme apache servr nasmerovaný k inštalácii CMS systému, otestujeme v prehliadači adresu **http://<ip-adresa>/**

Moja inštalácia obsahuje informáciu "'mbstring' extension is not loaded. This is required for Grav to run correctly" čo znamená, že nemáme nainštalované potrebné balíčky pre beh tejto aplikácie.

```sh
sudo apt install php7.0-mbstring php7.0-xml php7.0-curl php7.0-gd
sudo systemctl restart apache2
```

Pridal som aj niekoľko ďalších php rozšírení, ktoré si Grav pýtal pri testovaní či, ho už viem spustiť.
Inštalácia grav sa ešte sťažuje na chýbajúci apache modul mod_rewrite, ktorý slúži na tvorbu tvz. pekných linkov. Mod rewrite sa nainštaloval už pri inštalácii balíčka **apache2** a preto ho potrebujeme pomocou pomocných príkazov povoliť.

```sh
sudo a2enmod rewrite
sudo systemctl restart apache2
```

V tomto stave mozeme už konfigurovať CMS systém Grav pomocou jeho webovej administrácie.

# FAQ - ďalšie odporúčané konfigurácie

## Apache reload?

Pri konfiguráciach apachce servera sme sa mohli stretnúť s odporúčaniami použitia reload.

```sh
sudo systemctl reload apache2
```

Reload nevypína hlavné vlákno apache server, iba sa pokúsi znovu načítať konfiguráciu a prenastaviť svoje beh. Toto však nevieme použiť ak sme menili porty na akých má server fungovať. Pokiaľ je niečo čo apache server nevie vykonať pri reload, upozorní nás na to

## AllowOverride all?

Toto povolenie je pomerne silné pre používatela, preto sa pozrime aké sú ďalšie možnosti. Výcuc z dokumentácie hovorí

```
Syntax:	AllowOverride All|None|directive-type [directive-type] ...
```

* None - zablokujeme všetky nastavenia z .htaccess súboru, a jeho konfiguráciu budeme nútený vykonať priamo v konfigúrákoch servera (či už pre celý server alebo len konkrétny virtualhost).
* All - môžeme upravovať všetky vlastnosti apache servera pomocou .htaccess súboru
* directive-type [directive-type] ... - výpisom direktív ktoré môže používateľ meniť. Pár príkladov:

- Indexes - povoli pouzivatelovi zapnut vypnut a konfigurovat listing index priecinka
- Limit - povolovat/obmedzovat pristupy k priecinkom
- Options - nastavovanie apache specialit pre aktualny priecinok

https://httpd.apache.org/docs/2.4/mod/core.html#allowoverride

## Mysql server?

```sh
sudo apt install mysql-server php7.0-mysql
```

Pre mysql v produčnej prevádzke sa odporúča spustit rezšírenú autoconfiguráciu

```sh
mysql_secure_installation
```

Teraz vieme z ľubovolnej php aplikácie opužívať mysql databazu, pokiaľ chceme aj nástroj na jej administraciu môžeme si stiahnuť phpmyadmin

```sh
sudo apt install phpmyadmin
```

Phpmyadmin bude dostupny na **http://<ip-adresa>/phpmyadmin/**

## Upload veľkých súborov??

Upravime konfiguračný subor /etc/php/7.0/apache2/php.ini

Nájdeme nastavenie upload_size a nastavíme na nami požadovanú hodnotu napr. 10M, 100M, 1G. Súbor uložíme a reštartujeme apache server.

## Overenie konfiguráce

Na overenie či je naša apache konfiguácia správna môžeme ešte pred reštartovaním použitím príkazu:

```sh
apachectl configtest
```

Použitím kontroly konfigurácie minimalizujeme dlhý výpadok servera v prípade nami vytvorenej chyby v apache konfigurácii.
