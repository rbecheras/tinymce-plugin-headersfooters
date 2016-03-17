# headersfooters

A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers - requires tinymce-plugin-paginate

## Dependencies

- tinymce
- noneditable tinymce native plugin
- [tinymce-plugin-paginate](https://github.com/sirap-group/tinymce-plugin-paginate)

## Installation

    bower install tinymce-plugin-headersfooters

## Post-install

You can create a bower Post-install hook, or make the symlinks manually to bind the vendor plugins to tinymce.

    echo "Installing tinymce-plugin-paginate ..."
    rm public/lib/tinymce/plugins/paginate 2> /dev/null
    ln -s ../../tinymce-plugin-paginate public/lib/tinymce/plugins/paginate && echo "> OK."

    echo "Installing tinymce-plugin-headersfooters ..."
    rm public/lib/tinymce/plugins/headersfooters 2> /dev/null
    ln -s ../../tinymce-plugin-headersfooters public/lib/tinymce/plugins/headersfooters && echo "> OK."
