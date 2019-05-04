### Leaderboard


TODO:
1. [Plan](https://www.lucidchart.com/documents/edit/14f64e4b-25d2-4ad8-8293-991efca1c2f1/0?shared=true&)
2. TCP server must detecting IP addreses and storign statistics to db


## Preinstallation
- NodeJS ~10
- Redis


## Installation

1. `npm i`
||
`yarn`

## Run it

1. `npm watch` - data consumption
2. `npm start` - returns results of contest as HTML str

## Usage
1. POST data to TCP server. Template object:
```
{
  "member": 1212,
  "first_name": "Ignatiy",
  "last_name": "Trololo",
  "score": 1313,
  "date": "02/01/2017"
}
```

2. GET available data turning to HTTP server

## Result
![Result table](./images/result.png "Results table")


## Contributing
Just me.
Pull requests are welcome :p

## License
[MIT](https://choosealicense.com/licenses/mit/)