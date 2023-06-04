# Conventions for components

Components can have specific names for specific behaviors

- **Basic**
  - No specific name
  - Describes any reusable component both 1st party or from libraries

- **Layout**
  - Skeleton structure of a page
  - Cannot interact with external resources (store, APIs)
  - Usually takes the whole page in space

- **Page**
  - Attached to router
  - Can interact with external resources (store, APIs)
  - Stitches layouts, basic components and page sections together

- **Page section**
  - Optional type of component
  - A page that is too complex can be divided into multiple page sections
  - It can access any external resource and perform side effects, but its scope should be as limited as possible
  - Typically, a form in a page can be a page section encapsulating validation as well and only outputting processed data

- **Page collection**
  - Optional type of component
  - When multiple pages share the same layout and/or some business logic, they can be grouped in a page collection
  - Typically, the logged section of a website can be a page collection, the public section can be another page collection and the login/logout/register pages can be a third page collection
  - They are attached to the router
  - They implement a layout and contain a &lt;router-outlet&gt;