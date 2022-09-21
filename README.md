# howmuch

This is a little sideproject of mine, basically a Next.js rewrite of [PetrolStationApp](https://github.com/hugohabicht01/PetrolStationApp).
I have never used React nor Next.js before and I'm currently just toying around with this, so expect some antipatterns...

*This only works inside Germany* due to the fact that the prices are fetched from https://creativecommons.tankerkoenig.de, which only has data from the MTK-S, a German federal agency

# Codestyle
As said previously, I'm still a massive beginner regarding React, therefore some antipatterns are to be expected
Apart from that, I'm trying to separate components by logic and displaying, so you will some components that contain the logic to a certain thing, which then use a "dumb" component to render the computed data

Some parts of this application are rather focussed on a functional programming style, as I recently fell in love with some aspects of functional programming. Another style that you can see being used is
errorhandling similar to rust, where a function either returns a good value or an error (instead of throwing it). This ensures that the errors a function can have are always kept in mind, as error and exception handling is a weak part of typescript in my opinion. Unfortunately we don't have access to the full rust error system, but it does the job.

This project does have some unittests written in vitest, testing some core parts, but most components are untested

