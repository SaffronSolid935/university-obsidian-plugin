# Saffron's University Plugin (for obsidian)

This is a plugin for the note‑taking app [Obsidian](https://obsidian.md/).

It helps you manage your university notes more efficiently by:

- simplifying the creation and organization of your note files,
- providing an easy way to import lecture and reading materials so you can open them instantly,
- automatically managing your folder structure to keep everything organized.

With this plugin, your study materials are always structured, easy to find, and quick to access.


## Installation

### Automatic

> **Note:** The package will not be updated automatically. You have update it over the community plugins settings.

1. Open the obsidian vault, where you want to install the plugin.
2. Go to `Settings > Community plugins`
3. Activate the community plugins if not done yet.
4. Search for `Saffron'S University Plugin` and install it.

### Manual (will be changed by a better method)

> Important: `Node.js` (`npm`) must be installed. <br>
> Not recommended for development. See the [development section](#development).

1. Clone this project (`git clone https://github.com/SaffronSolid935/university-obsidian-plugin.git`) or download it as zip (`Code > Download ZIP`).
2. If you have downloaded the zip file, extract it first.
3. Go into the project folder.
4. Install all dependencies with `npm install`.
5. Open a terminal and run `npm run build`.
6. Create the following path under the vault path if it does not exist:<br>
   `<vault>/.obsidian/plugins/university-obsidian-plugin`
7. Copy the following files from the project folder to the plugins path:
    - `main.js`
    - `style.js`
    - `manifest.json`
8. Open Obsidian, go to `Settings > Community plugins`, activate community plugins if not done yet, and activate `Saffron's University plugin`.

### Development

1. If it does not exist, create the folder`<vault>/.obsidian/plugins`.
2. Open the plugins folder in a terminal.
3. Run the following command:<br>
   `git clone https://github.com/SaffronSolid935/university-obsidian-plugin.git && cd university-obsidian-plugin`
4. Install all dependencies with `npm install`.
5. To compile you can run `npm run dev`. This can be run in the background.

> See also the [official documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)

## Links

-   [Usage](./USAGE.md)
-   [Error codes](./errorcodes.md)

## License

Applied license: [`GNU GPLv3`](./LICENSE)<br>
See also [third party notices](./THIRD_PARTY_NOTICES)

## Source

[Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin.git)
