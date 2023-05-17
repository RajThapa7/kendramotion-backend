const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const artistProfileSchema = require('../models/artistProfile.js');
const songSchema = require("../models/songs.js");
const movieSchema = require("../models/movies.js");


const Movie = mongoose.model('Movie', movieSchema);
const Song = mongoose.model('Song', songSchema);
const ArtistProfile = mongoose.model('ArtistProfile', artistProfileSchema);




app.post('/login', (req, res) => {
  
  const { username, password } = req.body;
  
  
});
    
app.get('/movies', (req, res) => {
    Movie.find({}, (err, movies) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(movies);
      }
    });
  });
  
  // POST method for movies
  app.post('/movies', (req, res) => {
    const { title, name, url, thumbImage, position } = req.body;
    const movie = new Movie({
      title,
      name,
      url,
      thumbImage,
      position,
    });
  
    movie.save((err, savedMovie) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        Movie.find({}, (err, movies) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json(movies);
          }
        });
      }
    });
  });
  
  // GET method for songs
  app.get('/songs', (req, res) => {
    Song.find({}, (err, songs) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(songs);
      }
    });
  });
  
  // POST method for songs
  app.post('/songs', (req, res) => {
    const { title, name, url, thumbImage, position } = req.body;
    const song = new Song({
      title,
      name,
      url,
      thumbImage,
      position,
    });
  
    song.save((err, savedSong) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        Song.find({}, (err, songs) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json(songs);
          }
        });
      }
    });
  });
  
  // GET method for artist profiles
  app.get('/artist-profiles', (req, res) => {
    ArtistProfile.find({})
      .populate('latestRelease.movies')
      .populate('latestRelease.songs')
      .exec((err, profiles) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(profiles);
        }
      });
  });
  
  // POST method for artist profiles
  app.post('/artist-profiles', (req, res) => {
    const { name, profileImage, designation, position, latestRelease } = req.body;
    const artistProfile = new ArtistProfile({
      name,
      profileImage,
      designation,
      position,
      latestRelease,
    });
  
    artistProfile.save((err, savedProfile) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        ArtistProfile.find({})
          .populate('latestRelease.movies')
          .populate('latestRelease.songs')
          .exec((err, profiles) => {
            if (err) {
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.json(profiles);
            }
          });
      }
    });
  });
  
