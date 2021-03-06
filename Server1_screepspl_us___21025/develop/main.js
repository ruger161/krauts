const roleHarvester = require('role.harvester');
const roleMiner = require('role.miner');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleHealer = require('role.healer');
const roleCarrier = require('role.carrier');
const roleClaimer = require('role.claimer');
const roleGuard = require('role.guard');
const roleSwarm = require('role.swarm');

const buildingTower = require('building.tower');
const utilCommon = require('utils.common');

let spawn1 = Game.spawns['Spawn1'];

let count;
// try {
module.exports.loop = function () {

    // if (!utilCommon.waitForTicks(10)) {
    //     if (Game.time % 2)
    //         console.log("Tick");
    //     else
    //         console.log("Tack");
    //
    // } else {
    //     console.log("It Worked!");
    // }

    // utilCommon.getMiningSide()

    let room = Game.spawns['Spawn1'].room;

    let spawnEnergy = utilCommon.getAmountOfEnergyForSpawn(room);
    if (false) {
        // Memory.flags = {};
        let flags = Game.rooms['E5S8'].find(FIND_FLAGS);
        flags.forEach((flag) => {
            // Memory.flags[flag.name] = {};
            Memory.flags[flag.name] = flag;
            // Memory.flags[flag.name].usedBy = {}
        });
    }

    let name;
    let tower;
    let hostile = utilCommon.hostileCreep(spawn1.pos);
    let hostiles = spawn1.room.find(FIND_HOSTILE_CREEPS);

    try {
        //Safe Mod
        if (Game.spawns['Spawn1'].hits < Game.spawns['Spawn1'].hitsMax && tower.energy === 0 && hostile) {
            room.controller.activateSafeMode();
        }
    } catch (e) {
        console.log("Error in Safe Mod Try" + e);
    }

    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            // console.log('Clearing non-existing creep memory:', name);
        }
    }

    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    let miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    let healers = _.filter(Game.creeps, (creep) => creep.memory.role === 'healer');
    let claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
    let guards = _.filter(Game.creeps, (creep) => creep.memory.role === 'guard');
    let swarms = _.filter(Game.creeps, (creep) => creep.memory.role === 'swarm');
    let towers = spawn1.room.find(FIND_STRUCTURES, {
        filter: structure => {
            return structure.structureType === STRUCTURE_TOWER
        }
    });

    let carrier = _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier');

    //helpers for Spawning
    let constructionSides = room.find(FIND_CONSTRUCTION_SITES);
    let harvesterX;
    if (miners.length > 0) {
        harvesterX = 4;
    } else {
        harvesterX = 8;
    }
    let minerX = 2;
    let builderX = 4;
    let upgraderX = 2;
    let enoughHarvester = (harvesters.length > (harvesterX - 2));
    let enougMiner = (miners.length > 0);
    /* ############### MINER ################*/
    let isOneMiningSideFree = utilCommon.freeMiningSide()[0];
    let miningSide = utilCommon.freeMiningSide()[1];


    /* ############### CARRIER ################*/
    let isOneCarryableFree = utilCommon.findCarryableMiningSide()[0];
    let carrySide = utilCommon.findCarryableMiningSide()[1];
    // console.log(Game.time % 10===0);

    // console.log("!spawn1.spawning: "+ (!spawn1.spawning));
    // console.log("!spawn1.spawning: "+ (!spawn1.spawning) +" Game.time % 10 === 0: "+ (Game.time % 10 === 0));
    // console.log("isOneMiningSideFree: "+ (isOneMiningSideFree) +" spawnEnergy > 600: "+ (spawnEnergy > 600));
// console.log(!spawn1.spawning);
    if (harvesters.length < harvesterX) {
        let targets = spawn1.room.find(FIND_SOURCES);
        let newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {
            role: 'harvester',
            target: targets[Game.time % 2],
            carry: false
        });
        if (!(newName < 0))
            console.log('Spawning new harvester: ' + newName);

    }
    if (enoughHarvester && isOneMiningSideFree && spawnEnergy > 600) {
        let newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], undefined, {
            role: 'miner',
            targetName: miningSide.name
        });
        if (!(newName < 0))
            console.log('Spawning new big miner: ' + newName);
    } else if (enoughHarvester && isOneMiningSideFree) {
        let newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {
            role: 'miner',
            targetName: miningSide.name
        });
        if (!(newName < 0))
            console.log('Spawning new miner: ' + newName);
    }
    if (!isOneMiningSideFree && isOneCarryableFree && spawnEnergy > 1100 && enoughHarvester && true) {
        let newName = Game.spawns['Spawn1'].createCreep([
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE

        ], undefined, {
            role: 'carrier',
            targetName: carrySide.name
        });
        if (!(newName < 0))
            console.log('Spawning new big carrier: ' + newName);
    } else if (!isOneMiningSideFree && isOneCarryableFree && enoughHarvester && true) {
        let newName = Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {
            role: 'carrier',
            targetName: carrySide.name
        });
        if (!(newName < 0))
            console.log('Spawning new carrier: ' + newName);
    }

    if (false) {
        console.log("#####################" +
            "\nBig Builder: " +
            (!isOneCarryableFree && !isOneMiningSideFree) + " " + (builders.length < builderX) + " " + (enoughHarvester) + " " + (constructionSides.length > 0) + " " + (spawnEnergy > 600) +
            "\nBuilder: " +
            ((!isOneCarryableFree && !isOneMiningSideFree)) + " " + ((builders.length < builderX) + " " + (enoughHarvester) + " " + (constructionSides.length > 0)) +
            "\nupgrader: " +
            (!isOneCarryableFree && !isOneMiningSideFree) + " " + (upgraders.length < upgraderX) + " " + (enoughHarvester) +
            "\nHealer: " +
            (!isOneCarryableFree && !isOneMiningSideFree) + " " + (healers.length < 2) + " " + (enoughHarvester));
    }

    if (!isOneCarryableFree && !isOneMiningSideFree && builders.length < builderX && enoughHarvester && constructionSides.length > 0 && spawnEnergy > 600) {
        let newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {role: 'builder'});
        if (!(newName < 0))
            console.log('Spawning new Big builder: ' + newName);
    } else if (!constructionSides.length) {
        //Kill 2 Builder while there is nothing to build
        for (name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.memory.role === 'builder') {
                utilCommon.recycle(creep);
                count++;
            }

        }
    }else if(!isOneCarryableFree && !isOneMiningSideFree && builders.length < builderX && enoughHarvester && constructionSides.length > 0) {
        let newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
            role: 'builder'
        });
        if (!(newName < 0))
            console.log('Spawning new builder: ' + newName);
    }

    if (!spawn1.spawning && !isOneCarryableFree && !isOneMiningSideFree && upgraders.length < upgraderX && enoughHarvester) {
        let newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'upgrader'});
        if (!(newName < 0))
            console.log('Spawning new upgrader: ' + newName);
    }

    if (!spawn1.spawning && !isOneCarryableFree && !isOneMiningSideFree && healers.length < 2 && enoughHarvester) {
        let newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'healer'});
        if (!(newName < 0))
            console.log('Spawning new healer: ' + newName);
    }

    if(!spawn1.spawning && !isOneCarryableFree && !isOneMiningSideFree && claimers.length < 1 && enoughHarvester && spawnEnergy > 800 && false) {
        let newName = Game.spawns['Spawn1'].createCreep([CLAIM, MOVE], undefined, {
            role: 'claimer',
            target: ''
        });
        if (!(newName < 0))
            console.log('Spawning new claimer: ' + newName);
    }

    if (guards.length < 3 && enoughHarvester && spawnEnergy > 510 && false) {
        let newName = Game.spawns['Spawn1'].createCreep([ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], undefined, {
            role: 'guard',
            target: ''
        });
        if (!(newName < 0))
            console.log('Spawning new big guard: ' + newName);
    } else if (!spawn1.spawning && guards.length < 3 && enoughHarvester && false) {
        let newName = Game.spawns['Spawn1'].createCreep([ATTACK, ATTACK, MOVE, MOVE], undefined, {
            role: 'guard',
            target: ''
        });
        if (!(newName < 0))
            console.log('Spawning new guard: ' + newName);
    }

    if (swarms.length < 3 && enoughHarvester && spawnEnergy > 510 && false) {
        let newName = Game.spawns['Spawn1'].createCreep([RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], undefined, {
            role: 'swarm',
            target: ''
        });
        if (!(newName < 0))
            console.log('Spawning new big swarm: ' + newName);
    } else if (swarms.length < 3 && enoughHarvester && false) {
        let newName = Game.spawns['Spawn1'].createCreep([RANGED_ATTACK, MOVE], undefined, {
            role: 'swarm',
            target: ''
        });
        if (!(newName < 0))
            console.log('Spawning new swarm: ' + newName);

    }

    if (Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        room.visual.text(
            '✳️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    //Run Tower
    if (true) {
        for (let i = 0; i < towers.length; i++) {
            let tower = Game.getObjectById(towers[i].id);
            buildingTower.run(tower);
        }
    }

    //Rune Specifiv Role of Creep
    for (name in Game.creeps) {
        let creep = Game.creeps[name];
        if (hostiles.length > 2 && spawnEnergy < 1000 && creep.memory.role !== 'healer' && creep.memory.role !== 'miner' && creep.memory.role !== 'carrier') {
            roleHarvester.run(creep);
        } else {
            if (creep.memory.role === 'harvester') {
                //roleHarvester.targetFlag;
                roleHarvester.run(creep);
            }
            if (creep.memory.role === 'miner') {
                //roleHarvester.targetFlag;
                // console.log(creep.name);
                roleMiner.run(creep);
            }

            if (creep.memory.role === 'carrier') {
                roleCarrier.run(creep);
            }
            if (creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === 'builder') {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === 'healer') {
                roleHealer.run(creep);
            }
            if (creep.memory.role === 'claimer') {
                roleClaimer.run(creep);
            }
            if (creep.memory.role === 'guard') {
                roleGuard.run(creep);
            }
            if (creep.memory.role === 'swarm') {
                roleSwarm.run(creep);
            }
            if (creep.memory.role === undefined) {
                creep.suicide()
            }
        }

    }
};
// }
// catch (e) {
//     console.loo("Error in you Main: " + e);
// }