import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import { html, raw } from 'hono/html'
import { HtmlEscapedString } from "hono/utils/html";

const app = new Hono()
const session = true;

app.use('/static/*', serveStatic({ root: './' }))

interface SiteData {
  title: string
  description: string
  image: string
  children?: any
  session?: boolean
}
const Layout = (props: SiteData) => html`
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="${props.description}">
  <head prefix="og: http://ogp.me/ns#">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${props.title}">
  <meta property="og:image" content="${props.image}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <meta name="author" content="Mark Johnson" />
  <meta name="dcterms.date" content="2024-09-01" />  

  <title>${props.title}</title>
  <link rel="stylesheet" href="/static/css/reset.css" />
  <link rel="stylesheet" href="/static/css/index.css" />  
</head>
<body>
  <table class="header">
      <tr>
        <td colspan="5" rowspan="2" class="width-auto">
          <h1 class="title">RunCheck.sh</h1>
          <span class="subtitle">A service to check if your scripts have run</span>
        </td>
        <th>Version:</th>
        <td class="width-min">v0.0.1</td>
      </tr>
      <tr>
        <th>Updated:</th>
        <td class="width-min"><time style="white-space: pre;">2024-09-01</time></td>
      </tr>
      ${
        props.session === true ? html`
        <tr>
          <td class="width-min"><a href="/">Home</a></td>
          <td class="width-min"><a href="/checks">Checks</a></td>
          <td class="width-min"><a href="/channels">Channels</a></td>
          <td class="width-min"><a href="/settings">Settings</a></td>
          <td class="width-min"><a href="/logout">Logout</a></td>
          <th class="width-min">Health:</th>
          <td>1/2</td>
        </tr>` : html`
        <tr>
          <td class="width-min"><a href="https://runcheck.sh">Home</a></td>
          <td class="width-min"><a href="https://app.runcheck.sh/about">About</a></td>
          <td class="width-min"><a href="https://app.runcheck.sh/blog">Blog</a></td>
          <td class="width-min"><a href="https://app.runcheck.sh/pricing">Pricing</a></td>
          <td class="width-min"><a href="https://app.runcheck.sh/login">Login</a></td>
          <th class="width-min">Status:</th>
          <td>Healthy</td>
        </tr>`      
      }
    </table>
    ${props.children}
</body>
<footer style="position: fixed; left: 50%; bottom: 0; transform: translate(-50%, -50%); margin: 0 auto;" >
    <p>
      <a href="https://madeby.mijho.co">Made By mijho ❤️</a>
    </p>
  </footer>
  <script src="index.js"></script>
</html>
`

app.use('/static/*', serveStatic({ root: './' }))

const Content = async (props: { siteData: SiteData; name: string | Promise<HtmlEscapedString> }) => (
  <Layout {...props.siteData}>
    {props.name instanceof Promise ? await props.name : props.name}   
  </Layout>
)

app.get('/', (c) => {
  const props = {
    name: 'Hello World',
    siteData: {
      session: session,
      title: 'runcheck.sh',
      description: 'A service to check if your scripts have run',
      image: 'https://example.com/image.png',
    }
  }
  return c.html(<Content {...props} />)
})


app.get('/checks', (c) => {
  const props = {
    name: html`
      <h2>Failing Checks</h2>
      <table>
        <thead>
          <tr>
            <th class="width-auto">Check Name</th>
            <th class="width-min">Last Check</th>
            <th class="width-min">State</th>
          </tr>
        </thead>
        </tbody>
        <tr>
          <td>RunCheck.sh</td>
          <td class="width-min">2024-09-01 03:00:00</td>
          <td>Failing</td>
        </tr>
        </tbody>
      </table>
      <h2>Healthy Checks</h2>
      <table>
        <thead>
          <tr>
            <th class="width-auto">Check Name</th>
            <th class="width-min">Last Check</th>
            <th class="width-min">State</th>
          </tr>
        </thead>
        </tbody>
        <tr>
          <td>RunCheck.sh</td>
          <td class="width-min">2024-09-01 03:00:00</td>
          <td>Healthy</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: center;">
            <a href="https://app.runcheck.sh/checks/new">+ Add Check +</a>
          </td>
        </tr>
        </tbody>
      </table>    
    `,
    siteData: {
      session: session,
      title: 'runcheck.sh',
      description: 'A service to check if your scripts have run',
      image: 'https://example.com/image.png',
    }
  }
  return c.html(<Content {...props} />)
})

Deno.serve(app.fetch)