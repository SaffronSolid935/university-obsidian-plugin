#!/bin/sh

VAULT=""
DEFAULT_FOLDER=""
VERSION="latest"
OWNER="SaffronSolid935"
REPO="university-obsidian-plugin"
PRE_VERSION_PATH="https://github.com/$OWNER/$REPO/releases/download"
FILES="main.js manifest.json styles.css"
PLUGIN_PATH="saffron-university-manual-install"

detect_env(){
    OS="$(uname -s)"
    if [ "$OS" = "Darwin" ]; then
        ENV="macos"
    elif [ "$OS" = "Linux" ]; then
        DESKTOP=$(echo "$XDG_CURRENT_DESKTOP" | tr '[:upper:]' '[:lower:]')
        case "$DESKTOP" in
            *kde*) ENV="kde" ;;
            *gnome*|*unity*|*ubuntu*) ENV="gnome" ;;
            "") ENV="linux" ;;
            *) ENV="linux" ;;  
        esac
    else
        ENV="unknown"
    fi
}

ask_select_folder(){
    case "$ENV" in 
        macos)
            VAULT=$(osascript -e "POSIX path of (choose folder with prompt \"Select folder:\" default location POSIX file \"$DEFAULT_FOLDER\")")
            ;;
        gnome)
            VAULT=$(zenity --file-selection --directory --filename="$DEFAULT_FOLDER")
            ;;
        kde)
            VAULT=$(kdialog --getexistingdirectory "$DEFAULT_FOLDER")
            ;;
        *)
            echo "Your operating system ($ENV) is not supported to select the vault over the file explorer. Please use the argument --vault instead."
            echo "e.g.      ./install.sh --vault ~/Documents/Notes"
            exit 1
            ;;
    esac
    if [ "$VAULT" = "" ]; then
        exit 2
    fi
}

while [ $# -gt 0 ]; do
    case "$1" in
        --vault)
            VAULT="$2"
            shift 2
            ;;
        --version)
            VERSION="$2"
            shift 2
            ;;
    esac
done

if [ "$VAULT" = "" ]; then
    detect_env
    ask_select_folder
fi

echo "Using $VAULT as vault path."

case "$VAULT" in
    */)
        break
        ;;
    *)
        VAULT="$VAULT/"
        ;;
esac

mkdir -p "$VAULT.obsidian/plugins"
cd "$VAULT.obsidian/plugins"

if [ "$VERSION" = "latest" ]; then
    VERSION=$(curl -s "https://api.github.com/repos/$OWNER/$REPO/releases/latest" \
    | grep '"tag_name":' \
    | sed -E 's/.*"([^"]+)".*/\1/')
fi

mkdir -p "$PLUGIN_PATH"
cd "$PLUGIN_PATH"

for file in $FILES; do
    uri="$PRE_VERSION_PATH/$VERSION/$file"
    echo "Downloading $file ($uri)"
    response=$(curl -sSL -o "$file" "$uri")
    echo $response
done

