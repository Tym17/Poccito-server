# Protocol

## Client to Server

### Handshake

```
HI {NAME}
```
Tells the server the client is connecting and his name.

### Movement

```
MV {UP|DOWN|LEFT|RIGHT}
```
Tells the server in which direction the client is moving.

## Server to client

### Handshake

```
HELLO {ID} {X} {Y}
```
Responds to `HI` by telling the player its Id and position.

```
NEW {ID} {X} {Y} {NAME}
```
Server tells other client that a player connected

### Movements

```
QUIT {ID}
```
Player with ID quit

```
PPOS {ID} {X} {Y}
```
User {ID} has a new pos

### NPCs

```
NPC {ID} {X} {Y} {NAME}
```
Server tells clients there is a npc.

```
NPOS {ID} {X} {Y}
```
Server tells clients npc `ID` has moved