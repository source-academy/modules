# Development journal for rune module
## Todos:
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
- 10:20am - 16:40pm : implement anaglyph and hollusion animation
- 16:40pm - 17:00pm : touch up the documentation and comments

### 31 Jul 2021
- 11:00am - 13:15pm : implementing the image rune feature

### 2 Aug 2021
- 12:00pm - 1:00pm : meeting

### 5 Aug 2021
- 14:30pm - 15:10pm : fix bugs

### 
- 12:30pm - 1:00pm : working on #88

### 17 Aug 2021
- 18:00pm - 18:30pm : working on beside_frac and stack_frac definition
- 18:30pm - 19:00pm : fix the documentation of types #86

### 18 Aug 2021
- 21:50pm - 22:20pm : fix sail/triangle

### 19 Aug 2021
- 21:10pm - 23:20pm : fix the anaglyph/hollusion inverted problem #93, and improves CPU consumption of animation by limiting the framerate.