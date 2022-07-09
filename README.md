# Maiasaura
A maven repository built on Deno and stored Bunny.net's edge storage.

⚠️ This is still a WIP, things such as upload authentication are likely to change.

## Usage
Maiasaura can either be run on a local Deno runtime or on Deno deploy. The following environment variables are required
for it to run.

Note: For the time being it only supports one user for uploading artifacts, support for additional users will be added
in the future.

### Environment Variables

| Variable         | Description                                                                              |
|------------------|------------------------------------------------------------------------------------------|
| `BUNNY_ENDPOINT` | The storage endpoint to use. eg: `storage.bunnycdn.com`                                  |
| `BUNNY_ZONE`     | The name of the storage zone to use. This is similar to a S3 bucket                      |
| `BUNNY_KEY`      | The storage access key to use                                                            |
| `BUNNY_CDN`      | The endpoint of your cache pull zone. This is probably `<zone>.b-cdn.net`                |
| `TITLE`          | The title of your site. This will be in the `title` meta tag as well as on the home page |
| `USERNAME`       | The username to use for maven artifact uploading                                         |
| `HASH`           | A SCrypt-hashed password to use for maven artifact uploading                             |

## TODO
- Purge files from cache on put
- Database for storing maven users
- Build in way to generate password hashes
- Upload generate indexed html files to edge storage
- Automatic Javadoc expansion
