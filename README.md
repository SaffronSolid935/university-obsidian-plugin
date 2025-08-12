# Saffron's University Tool (for obsidian)

This is a Tool for the note‑taking app [Obsidian](https://obsidian.md/).

It helps you manage your university notes more efficiently by:

- simplifying the creation and organization of your note files,
- providing an easy way to import lecture and reading materials so you can open them instantly,
- automatically managing your folder structure to keep everything organized.

With this Tool, your study materials are always structured, easy to find, and quick to access.


## Installation

### Automatic

> **Note:** The package will not be updated automatically. You have update it over the community Tools settings.

1. Open the obsidian vault, where you want to install the Tool.
2. Go to `Settings > Community Tools`
3. Activate the community Tools if not done yet.
4. Search for `Saffron'S University Tool` and install it.

### Manual (will be changed by a better method)

> Important: `Node.js` (`npm`) must be installed. <br>
> Not recommended for development. See the [development section](#development).

1. Clone this project (`git clone https://github.com/SaffronSolid935/university-obsidian-Tool.git`) or download it as zip (`Code > Download ZIP`).
2. If you have downloaded the zip file, extract it first.
3. Go into the project folder.
4. Install all dependencies with `npm install`.
5. Open a terminal and run `npm run build`.
6. Create the following path under the vault path if it does not exist:<br>
   `<vault>/.obsidian/Tools/university-obsidian-Tool`
7. Copy the following files from the project folder to the Tools path:
    - `main.js`
    - `style.js`
    - `manifest.json`
8. Open Obsidian, go to `Settings > Community Tools`, activate community Tools if not done yet, and activate `Saffron's University Tool`.

### Development

1. If it does not exist, create the folder`<vault>/.obsidian/Tools`.
2. Open the Tools folder in a terminal.
3. Run the following command:<br>
   `git clone https://github.com/SaffronSolid935/university-obsidian-Tool.git && cd university-obsidian-Tool`
4. Install all dependencies with `npm install`.
5. To compile you can run `npm run dev`. This can be run in the background.

> See also the [official documentation](https://docs.obsidian.md/Tools/Getting+started/Build+a+Tool)

## Links

-   [Usage](./USAGE.md)
-   [Error codes](./errorcodes.md)

## License

Applied license: [`GNU GPLv3`](./LICENSE)<br>
See also [third party notices](./THIRD_PARTY_NOTICES)

## Source

[Obsidian sample Tool](https://github.com/obsidianmd/obsidian-sample-Tool.git)
