const fs   = require("fs");
const path = require("path");
const gui  = require("gui");

const menu = gui.MenuBar.create([{
  "label": "File",
  "submenu": [{
    "label"      : "Quit",
    "accelerator": "CmdOrCtrl+Q",
    "onClick"    : () => gui.MessageLoop.quit()
  }]},
  {
    "label": "Edit",
    "submenu": [
      {"role": "copy"},
      {"role": "cut"},
      {"role": "paste"},
      {"role": "select-all"},
      {"type": "separator"},
      {"role": "undo"},
      {"role": "redo"}
    ]
  }
]);

const win = gui.Window.create({});
win.setContentSize({"width": 400, "height": 400});
win.onClose = () => gui.MessageLoop.quit();

const contentView = gui.Container.create();
contentView.setStyle({"flexDirection": "row"});
win.setContentView(contentView);

let sidebar = gui.Container.create();

/*
 * if(process.platform == "darwin"){
 *   sidebar = gui.Vibrant.create();
 *   sidebar.setBlendingMode("behind-window");
 *   sidebar.setMaterial("dark");
 * }else{
 *   sidebar = gui.Container.create();
 * }
 */

sidebar.setStyle({
  "width": 300,
  "padding": 5,
  // "flexDirection": "row"
});
contentView.addChildView(sidebar);

const edit = gui.TextEdit.create();
edit.setStyle({"flex": 1});
// contentView.addChildView(edit);

let filename;
let folder;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const testLabel = gui.Label.create("Hello world!");

testLabel.setStyle({
  // "width" : 80,
  // "height": 20
});

const testEntry = gui.Entry.create();

testEntry.setStyle({
  "width" : 80,
  "height": 20
});

const btnRandomize = gui.Button.create({"title": "Randomize", "type": "radio"});

btnRandomize.setStyle({
  "width" : 50,
  "height": 20
});

btnRandomize.setChecked(true);

const btnSavePdf    = gui.Button.create("Save PDF");
const btnPrintLabel = gui.Button.create("Print Label");

testEntry.onTextChange = (self) => {
  var newText = self.getText();

  if(newText == "")
    btnRandomize.setChecked(true);
  else
    btnRandomize.setChecked(false);
}

btnRandomize.onClick = () => {
  testEntry.setText("");
}

btnSavePdf.onClick = () => {
  console.log("Save as .pdf file");
}

btnPrintLabel.onClick = () => {
  console.log("Send to printer");
}

sidebar.addChildView(testLabel);
sidebar.addChildView(testEntry);
sidebar.addChildView(btnRandomize);
sidebar.addChildView(btnSavePdf);
sidebar.addChildView(btnPrintLabel);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const open = gui.Button.create("");
open.setImage(gui.Image.createFromPath(__dirname + "/eopen@2x.png"));
open.setStyle({"marginBottom": 5});

open.onClick = () => {
  const dialog = gui.FileOpenDialog.create();

  dialog.setOptions(gui.FileDialog.optionShowHidden);
  dialog.setFilters([{
    "description": "All Files",
    "extensions" : ["*"]
  },{
    "description": "JavaScript Files",
    "extensions" : ["js"]
  }]);

  if(dialog.runForWindow(win)){
    const p = dialog.getResult();

    folder   = path.dirname(p);
    filename = path.basename(p);

    edit.setText(String(fs.readFileSync(p)));
    edit.focus();

    win.setTitle(filename);
  }
}

sidebar.addChildView(open);

const save = gui.Button.create("");
save.setImage(gui.Image.createFromPath(__dirname + "/esave@2x.png"));

save.onClick = () => {
  if(!folder)
    return;

  const dialog = gui.FileSaveDialog.create();
  dialog.setFolder(folder);
  dialog.setFilename(filename);

  if(dialog.runForWindow(win)){
    fs.writeFileSync(String(dialog.getResult()), edit.getText());
  }
}

sidebar.addChildView(save);
sidebar.setStyle({
  "width": sidebar.getPreferredSize().width
});

if(process.platform == "darwin")
  gui.app.setApplicationMenu(menu);
else
  win.setMenuBar(menu);

win.center();
win.activate();

if(!process.versions.yode){
  gui.MessageLoop.run();
  process.exit(0);
}
