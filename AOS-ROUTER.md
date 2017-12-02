# Linux router

V nasledujúcom návode vytvoríme z linuxového servera, výkonný router.

Potrebujeme počítač s aspoň 2 sieťovkami, v prvej sieťovke (nazveme WAN) bude nastavený DHCP klient a v druhej sieťovke (nazveme LAN) postupne vytvoríme nastavenia pomocou, ktorých bude náš počítač vystupovať ako NAT router a presmeruje všetkú komunikáciu do WAN sieťovky.

## Nastavenie IP adries pre sieťovky

Pomocou príkazu `ifconfig` a `ip link show` si overíme, ktoré HW názvy prislúchajú ktorým stieťovkám. V mojej inštalácii enp0s3 bude WAN a enp0s8 bude LAN

Konfigurácie IP adries v linuxe nájdeme v súbore **/etc/network/interfaces**

```sh
sudo nano /etc/network/interfaces
```

Nastavenia WAN je pomerne jednochuché, keďže použíjeme dhcp klienta na autokonfifuráciu tejto sieťovky.

```sh
# WAN network interface
auto enp0s3
iface enp0s3 inet dhcp
```

Pre LAN už potrebujeme nastaviť všetky informácie ktoré sa pri WAN urobia automaticky (pomocou DHCP).

```sh
# LAN network interface
auto enp0s8
iface enp0s8 inet static
	address 192.168.99.1
	netmask 255.255.255.0
	network 192.168.99.0
	broadcast 192.168.99.255
```

Túto konfiguráciu uložíme a reštartujeme sieťové rozhrania.

```sh
sudo systemctl restart networking
```

## Nastavenia routovania

Defaultne je routovanie v linuxe zablokované, preto ho trvalo povolíme. 
V súbore **/etc/sysctl.conf**. Nájdeme **net.ipv4.ip_forward** a upravíme konfiguráciu tak aby obsahovala:

```
net.ipv4.ip_forward=1
```

Po uložení potrebujeme aplikovať novú konfiguráciu príkazom

```sh
sudo sysctl -p /etc/sysctl.conf
```

Pre overenie, či bolo nastevenie úspešné

```
cat /proc/sys/net/ipv4/ip_forward
```

Výstupom bude číslo **1**

Zatiaľ sme len povolili forwardovanie paketov cez náš počítač, potrebujeme však ešte nastaviť NAT, aby sme boli schopný, doručiť odpoveď vzdialeného server k cieľovému počítaču, ktorý vyslal požiadavku.

sudo iptables --table nat --append POSTROUTING --out-interface eth0 -j MASQUERADE
sudo iptables --append FORWARD --in-interface eth1 -j ACCEPT

> Pokiaľ potrebujeme vyprázdniť nastavené pravidlá v iptables:
> ```
> iptables -F
> iptables --table nat -F
> ```

Tieto nastavenia iptables vsak ostanu len do najbližšieho reštartu pc. Pokiaľ chceme aby nastavenia boli stále môžeme použiť balík **iptables-persistent**, alebo budeme automatizovane ukladať a načítavať konfiguráciu. V tomto návode si ukážeme práve tú druhú možnosť.
Vytvoríme skripty, ktoré network manažér bude spúštať.

### Pre obnovenie konfigurácie

```
sudo nano /etc/network/if-pre-up.d/iptablesload
```

```
#!/bin/sh
iptables-restore < /etc/iptables.rules
exit 0
```

### Pre uloženie konfigurácie

```sh
sudo nano /etc/network/if-post-down.d/iptablessave
```

```sh
#!/bin/sh
iptables-save -c > /etc/iptables.rules
if [ -f /etc/iptables.downrules ]; then
   iptables-restore < /etc/iptables.downrules
fi
exit 0
```

> POZNAMKA: parameter -c bude ukladať aj hodnoty jednotlivých counterov a preto neprídeme ani o počty prenesených paketov

Nakoniec pre oba súbory nastavíme príznak spustiteľnosti
```sh
sudo chmod +x /etc/network/if-post-down.d/iptablessave
sudo chmod +x /etc/network/if-pre-up.d/iptablesload
```

Teraz sa už všetky nastavenia budú ukladať pred reštartom pc a po zapnutí sa načítajú.

Teraz už máme vytvorený linuxový NAT router, avšak ešte nie je veľmi použiteľný v bežnej prevádzke, pretože každého klienta by sme museli ručne pripojiť do siete a nastaviť mu voľnú ip adresu.

## DHCP server

DHCP je protokol určený na automatickú konfiguráciu klientov pripojených do siete. V našom prostredí budeme pomovou dhcp servera pridelovat ip-adresy nastavovat adresu brány (gateway, a.k.a. adresu linuxového routra), sietovu masku a servery DNS.

```sh
sudo apt install isc-dhcp-server
```

V prvom kroku konfigurácie potrebujeme nastaviť sieťovku na ktorej bude dhcp server počúvať. Urobíme tak v súbore /etc/default/isc-dhcp-server.

```sh
sudo nano /etc/default/isc-dhcp-server
```

Nájdeme parameter INTERFACES a pridáme tam názov LAN sietovky.

```
INTERFACES="enp0s8"
```

> V prípade ak chceme počúvať na viacerých adresách názvy sieťoviek oddelíme medzerou.

Po vzore z apahce servera vytvorme konfiguračný priečinok **/etc/dphcp/sites-enabled/**, a importujme cely jeho obsah hlavným konfiguračným súborom **dhcpd.conf**

```
cd /etc/dhcp
sudo mkdir sites-enabled
sudo mkdir sites-available
sudo nano dhcpd.conf
sudo su -c 'echo "include \"/etc/dhcp/sites-enabled/all.conf\";" >> /etc/dhcp/dhcpd.conf'
```

Vytvoríme si helper príkazy dhcpdensite, dhcpddissite:

```
sudo nano /etc/dhcp/dhcpdensite
```

```
#!/bin/bash

ln -s /etc/dhcp/sites-available/$1.conf /etc/dhcp/sites-enabled/$1.conf

cd /etc/dhcp/sites-enabled

echo "# import vsetkych konfiguracii" > all.conf

for dr in *
do
    if [[ $dr != "all.conf" ]]
    then
        echo "include \"$PWD/$dr\";" >> all.conf
    fi
done

systemctl restart isc-dhcp-server

```

```
sudo nano /etc/dhcp/dhcpddissite
```

```
#!/bin/bash

rm -d /etc/dhcp/sites-enabled/$1.conf

cd /etc/dhcp/sites-enabled

echo "# import vsetkych konfiguracii" > all.conf

for dr in *
do
    if [[ $dr != "all.conf" ]]
    then
        echo "include $dr;" >> all.conf
    fi
done

systemctl restart isc-dhcp-server

```

a nastavíme im príznak spustiteľnosti

```sh
sudo chmod +x /etc/dhcp/dhcpdensite
sudo chmod +x /etc/dhcp/dhcpddissite
```

> TODO: ak ich cheme používať globálne tak ich presunieme do /bin (alebo len odkazy na nich)


Vytvorme si teraz prvú sieť v priečinku sites-available

```sh
sudo nano /etc/dhcp/sites-available/192-168-99.conf
```

s obsahom, ktorý vytvorí sieť 192.168.99.0 a demonštruje vytvorenie voľného rozsahu IP-adries, nastavenie brány a jedno statické pridelenie ip adresy

```
subnet 192.168.99.0 netmask 255.255.255.0 {
    range 192.168.99.100 192.168.99.254;
    option routers 192.168.99.1
    group {
        host pc1 {
            hardware ethernet A8:61:A4:99:48:28;
            fixed-address 192.168.99.2;
        }
    }
}
```

Po takto pripravenej konfigurácii môžeme spustiť dhcp server a otestovať jeho funkčnosť.

```sh
sudo systemctl restart isc-dhcp-server
```

## DNS server

Nazabudnutou súčasťou routra by mal byť aj DNS server, ponúkanie vlastné dns servera, či už formou cache alebo resolvera znižuje internetovú prevádzku (WAN) a dodáva nám možnosti pridania lokálnych doménových mien.

```sh
sudo apt install bind9 bind9utils bind9-doc
```

Teraz nastavíme aby DNS server odpovedal len na adresy z nášho LAN rozsahu a pre localhost. Upravujeme konfiguračný súbor **named.conf.options** tak aby obsahoval tento text

```sh
sudo nano /etc/bind/named.conf.options
```

```
# Zoznam povolených rozsahov
acl goodclients {
    192.168.99.0/24;
    localhost;
    localnets;
};

options {
		# miesto kde si bude ukladat uz známe adresy
        directory "/var/cache/bind";

        recursion yes;
        # budeme odpovedať len na nasich klientov
        allow-query { goodclients; };

        dnssec-validation auto;

        auth-nxdomain no;    # conform to RFC1035
        listen-on-v6 { any; };
};

```

DNS server je takto nakonfigurovaný a môžeme ho spustiť

```sh
sudo systemctl status bind9
```

Teraz doplníme do dhcp-servera ip adresu nasho DNS servera.

V dhcp súbore pre našu sieť v časti `subnet` doplníme option domain-name-servers

```sh
sudo nano /etc/dhcp/sites-available/192-168-99.conf
```

```
    option domain-name "patrikova-siet";
    option domain-name-servers  192.168.99.1;
```

Ešte reštartujeme dhcp server a máme vytvorený plnohodnotný linuxový router.

```sh
sudo systemctl restart isc-dhcp-server
```

# FAQ - Ďalšie možnosti konfigurácií

## Firewall - Obmedzenie prístupov na porty

## Statické priradenie IP v dhcp

V konfigurácii dhcp site a v jej časti `subnet -> group` vložíme konfiguráciu vo formáte

```
        host <názov pc> {
            hardware ethernet <mac adresa vo formáte XX:XX:XX:XX:XX:XX>;
            fixed-address <pridelená ip adresa>;
        }

```

## Výpis aktuálnych výpožičiek

Na výpis výpožičiek dáme vypísať tento súbor

```
cat /var/lib/dhcp/dhcpd.leases
```

## Statické priradenie do DNS

