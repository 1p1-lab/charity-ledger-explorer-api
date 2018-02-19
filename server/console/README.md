# Console commands

To run console command:
```
node server/console.js <command> [options]
```


## programs:import
```
programs:import [options] <fileName>
```

Import foundation programs to blockchain

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _fileName_ - path to CSV-file. **Required**

## programs:update
```
programs:import [options]
```

Load foundation programs from blockchain to local storage

Input:
* _-f/--foundation ID_ - foundation ID. **Required**

## projects:import
```
projects:import [options] <fileName>
```

Import foundation projects to blockchain

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _fileName_ - path to CSV-file. **Required**

## projects:update
```
projects:import [options]
```

Load foundation projects from blockchain to local storage

Input:
* _-f/--foundation ID_ - foundation ID. **Required**

## targets:import
```
targets:import [options] <fileName>
```

Import foundation targets to blockchain

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _fileName_ - path to CSV-file. **Required**

## targets:update
```
targets:import [options]
```

Load foundation targets from blockchain to local storage

Input:
* _-f/--foundation ID_ - foundation ID. **Required**

## costs:import
```
costs:import [options] <fileName>
```

Import foundation cost items to blockchain

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _fileName_ - path to CSV-file. **Required**

## costs:update
```
costs:import [options]
```

Load foundation cost items from blockchain to local storage

Input:
* _-f/--foundation ID_ - foundation ID. **Required**

## donators:import
```
donators:import [options] <fileName>
```

Import donators to blockchain

Input:
* _fileName_ - path to CSV-file. **Required**

## donators:update
```
donators:import [options]
```

Load donators from blockchain to local storage

## donations:import
```
donations:import [options] <fileName>
```

Import foundation donations to blockchain

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _fileName_ - path to CSV-file. **Required**

## donations:update
```
donations:import [options]
```

Load foundation donations from blockchain to local storage

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _--min-date date_ - start date (YYYY-MM-DD). **Required**
* _--max-date date_ - end date (YYYY-MM-DD). Default - current date
 
## expenses:import
```
expenses:import [options] <fileName>
```

Import foundation expenses to blockchain

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _fileName_ - path to CSV-file. **Required**

## expenses:update
```
expenses:import [options]
```

Load foundation expenses from blockchain to local storage

Input:
* _-f/--foundation ID_ - foundation ID. **Required**
* _--min-date date_ - start date (YYYY-MM-DD). **Required**
* _--max-date date_ - end date (YYYY-MM-DD). Default - current date
 
