const fs = require('fs');
const express = require('express');

var app = require('express')();
var io = require('socket.io')(http);
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create_game_db', function(req, res){
  const db_name = req.body.db_name;

  let path = __dirname+'/public/game_version/'+db_name+'/';
  let items = __dirname+'/public/game_version/'+db_name+'/items/'
  let characters = __dirname+'/public/game_version/'+db_name+'/characters/';
  
  if (fs.existsSync(path)){
    console.log('FAILED! Path '+path+' already exists!');
  }
  else{
    fs.mkdir(path, function(err){
      if (err){
        console.log('Error: '+err);
      }
      else{
        console.log('New directory made. Path: '+path);
      }
    });

    fs.mkdir(items, function(err){
      if (err){
        console.log('Error: '+err);
      }
      else{
        console.log('Item path succesfully made. Path: '+path);
      }
    });

    fs.mkdir(characters, function(err){
      if (err){
        console.log('Error: '+err);
      }
      else{
        console.log('Character path succesfully made. Path: '+characters);
      }
    });
  }
});

app.post('/create_person', function(req, res){
  const person = req.body.name;
  const game = req.body.game_name;

  let path = __dirname+'/public/game_version/'+game+'/';
  let person_in_path = path+person;
  let attributes_in_person = __dirname+person_in_path+'/attributes/';
  let inventory_for_person = __dirname+person_in_path+'/inventory/';
  let name_file = attributes_in_person+'name.txt';

  if (fs.existsSync(path)){
    console.log('Writing to directory: '+path);

    if (fs.existsSync(person_in_path)){
      console.log('FAILED to create person, person already exists!');
    }
    else{
      fs.mkdir(person_in_path, function(err){
        if (err){
          console.log('Error: '+err);
        }
        else{
          fs.mkdir(attributes, function(err){
            if (err){
              console.log('Error: '+err);
            }
            else{
              console.log('Attributes Directory created at: '+attributes_in_person);

              fs.appendFileSync(name_file, person, function(err){
                if (err){
                  console.log('Error: '+err);
                }
                else{
                  console.log('Attributes succesfully added!');
                }
              });
            }
          });

          fs.mkdir(inventory_for_person, function(err){
            if (err){
              console.log('Error: '+err);
            }
            else{
              console.log('Inventory Directory created at: '+inventory_for_person);
            }
          });
           
          console.log('Person created!');
        }
      });

      console.log('Created Person at: '+person_in_path);
    }
  }
  else{
    console.log('FAILED to create person! Game does not exist in database!');
  }
  
});

app.post('/create_new_folder', function(req, res){
  const folder_belongs_to_which_game = req.body.game;
  const folder_name = req.body.folder;

  let folder_in_game = __dirname+'/public/game_version/'+folder_belongs_to_which_game+'/'+folder_name+'/';

  if (fs.existsSync(folder_in_game)){
    console.log('Error: Directory already exists at: '+folder_in_game);
  }
  else{
    fs.mkdir(folder_in_game, function(err){
      if (err){
        console.log('Error: '+err);
      }
      else{
        console.log('Path created at '+folder_in_game);
      }
    });
  }
});

app.post('/create_new_folder', function(req, res){
  const new_folder_name = req.body.new_folder_name;
  const new_folder_name_game_dir = req.body.game;
  
  let new_folder_dir = __dirname+'/public/game_version/'+new_folder_name_game_dir+'/';
  let new_folder_location = new_folder_dir+new_folder_name;

  if (fs.existsSync(new_folder_name_game_dir)){
    if (fs.existsSync(new_folder_location)){
      console.log('Folder already exists!');
    }
    else{
      fs.mkdir(new_folder_location, function(err){
        if (err){
          console.log('Error: '+err);
        }
        else{
          console.log('Folder Created!')
        }
      });
    }
  }
  else{
    console.log('Game or Directory does not exist!')
  }
});

app.post('/create_new_file', function(req, res){
  const new_file_name = req.body.new_file_name;
  const new_file_name_game_dir = req.body.game;
  const new_file_contents = req.body.contents;
  
  let new_file_dir = __dirname+'/public/game_version/'+new_file_name_game_dir+'/';
  let new_file_location = new_file_dir+new_file_name;

  if (fs.existsSync(new_file_dir)){
    if (fs.existsSync(new_file_location)){
      console.log('File '+new_file_location+' already exists!');
    }
    else{
      fs.appendFileSync(new_file_location, new_file_contents, function(err){
        if (err){
          console.log('Error: '+err);
        }
        else{
          console.log('File created!');
        }
      });
    }
  }
  else{
    console.log('Directory and Game does not exist!');
  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});