# Manuel de développement

En cas de blocage du port, jouer : 

~~~shell
pkill -f bun
pkill -f electron
~~~

… pour tuer tous les processus. Mais attention : ça tue vraiment tous les processus. Si d’autres applications identiques sont en route, elles seront aussi arrêtées. Peut-être passer plutôt par le monitor d’activité.





## Temps

Explication des temps dans la base de données et le programme.

| Nom               | Persistance | Description                                                  |
| ----------------- | ----------- | ------------------------------------------------------------ |
| **`cycleTime`**   | Oui         | Définit la durée de travail qu’il faut avoir effectué pour considérer que le travail a couvert un cycle. Parfois, ça peut se faire en plusieurs sessions (grâce à `sessionTime`). |
| **`sessionTime`** | Oui         | Détermine la durée que doit avoir une session de travail pour le travail donné. Souvent, cette durée sera égale à la durée pour un cycle de travail. Mais lorsqu’elle est inférieure (elle ne peut être qu’inférieur, sinon le travail ne serait jamais fini).<br />Noter que quelle que soit le temps vraiment fait sur une session, à la session suivante, la même durée sera proposée. C’est donc vraiment une propriété de travail. |
| **`restTime`**    | Oui         | Durée restante pour que le cycle soit complet pour le travail. |
| **`totalTime`**   | Oui         | Durée totale de travail sur le projet, tous cycles confondus. |
| **`workedTime`**  | Non         | Durée déjà effectuée dans le cycle courant. On a donc `workedTime + restTime = cycleTime`. |

## Locales

Pour checker les locales, c’est-à-dire voir celles qui sont à ajouter, lancer : 

~~~shell
bun run check-locales
~~~

### Ajouter une langue

Pour ajouter une langue, dupliquer un dossier de `lib/locales/, le renommer avec les deux lettres de la langue, puis corriger tous les textes.
