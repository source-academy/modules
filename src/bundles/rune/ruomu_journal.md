# Development journal for rune module
## Todos:
- 3D drawing
- animate
## Future directions:
- improve efficiency by compress representation using index/programInfo/gl.TRIANGLE_FAN etc.
- improve efficiency by using texture cache
- improve efficiency by instance drawing, however, please keep it KISS

## Work Log
### 25 Jul 2021
- 2:00pm - 7:30pm : get familiar with Typescript, the project structure and webGL basics. tried to directly port Runes but failed. Propose to refactor the library to make everything clearer and coherent with the current coding style.

### 26 Jul 2021
- 9:30am - 12:30pm : implementing and porting
- 1:00pm - 7:00pm : finish porting the drawing and basic shapes

### 27 Jul 2021
- 10:00am - 12:30pm : write API documentation and check coding standard compliance
- 1:00pm - 1:30pm : check git workflow and create branches/pull request etc.

### 28 Jul 2021
- 9:00am - 9:40am : check webgl ANGLE instance drawing, decide to postpone it, because 1. it is not KISS; 2. it may not significant improve the performance; 3. it can be implemented orthorgonally with the current implementation
- 9:40am - 10:20am : implemented the color library