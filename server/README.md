# Server
Launch:
```
yarn install
yarn start
```

## Configuration
```json
{
    "port": 20117,
    "endofpacket": "\n"
}
```
Port value is used to determine on which port to listen. endofpacket is used  at the end of sent packets (changing it might cause the client to be unable to process incoming data).