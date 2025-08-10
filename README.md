# University (obsidian plugin)

## Installation

### Automatic

> Automatic updates are not guaranteed, but updating is easy.

*`not set yet`*

### Manual (no auto update)

> Important: `Node.js` (`npm`) must be installed. <br>
> Not recommended for development. See the [development section](#development).

1. Clone this project (`git clone https://github.com/SaffronSolid935/university-obsidian-plugin.git`) or download it as zip (`Code > Download ZIP`).
2. If you have downloaded the zip file, extract it first.
3. Go into the project folder.
4. Open a terminal and run `npm run build`.
5. Create the following path under the vault path if it does not exist:<br>
`<vault>/.obsidian/plugins/university-obsidian-plugin`
6. Copy the following files from the project folder to the plugins path: 
    - `main.js`
    - `style.js`
    - `manifest.json`
7. Open Obsidian, go to `Settings>Community plugins`, activate community plugins if not done yet, and activate `Saffron's University Package`.

### Development

1. If it does not exist, create the folder`<vault>/.obsidian/plugins`.
2. Open the plugins folder in a terminal.
3. Run the follwing command:<br>
`git clone https://github.com/SaffronSolid935/university-obsidian-plugin.git && cd university-obsidian-plugin`
4. To compile you can run `npm run dev`. This can be run in the background.

> See also the [official documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)

## Usage

*`not set yet`*

## License

Applied license: [`GNU GPLv3`](./LICENSE)<br>
See also [third party notices](./THIRD_PARTY_NOTICES)

## Source

[Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin.git)