import { Render } from "../types.ts"
  
const render: Render = async (app, engine, template) => {
  // use provided server-side render function for browser goodness ^^
  const HTMLResult = await engine(app)    
  const HTML = await template(HTMLResult)

  return HTML
}

export default render
