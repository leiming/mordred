# mordred

A node server to generate online page

## Install

Use the below script:

```bash
$ cd mordred
$ yarn install
```

## Usage

### method:post

Post Data by form:
```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -d 'aaaa=1111&bbbb=2222' "http://localhost:7777/transform/basic"
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
<script>
var obj = {
  "aaaa": "1111",
  "bbbb": "2222"
}
</script>
</head>
<body>
<H1>Hello World</H1>
</body>
</html>
```

Post JSON as well:

```bash
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{"ccc": 123}' "http://localhost:7777/transform/basic"
```

### method:get

Open the below URL in browser:

```bash
http://localhost:7777/transform/basic/{"cccc":1111}
```

Then, visit result:
> http://localhost:7777/static/basic

### Get Template list

```bash
http://localhost:7777/templates
```

output:
```json
[
    {
        "name": "Advanced html",
        "title": "Second Page",
        "previewImage": "http://statics.techuangyi.com/uploadfile/2015/07/26/ae70614dca8eaf859f4fe4f85e7847df.jpg"
    },
    {
        "name": "basic html",
        "title": "First Page",
        "previewImage": "http://img.zcool.cn/community/017e4256c423d16ac7256cb0e35226.jpg"
    }
]
```
