const express = require('express');
const path = require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));