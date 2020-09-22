<template>
  <div>
    <h1>Rushing statistics</h1>
    <p>
        Filter by name: <input v-model="filter" v-on:keyup="from = 1; onGetPlayers()"/>
        Players per page: <input v-model="limit" v-on:keyup="onGetPlayers()"/>
        <button v-on:click="onExport()">Export</button>
        <button :disabled='!enablePreviousPageButton' v-on:click="from = from - limit > 0 ? from - limit : 1; onGetPlayers()">Previous page</button>
        <button :disabled='!enableNextPageButton' v-on:click="from += limit; onGetPlayers()">Next page</button>
    </p>

    <div v-if="players && players.length">
        <table>
            <thead>
                <tr>
                    <th v-for="(value, key) in players[0]" 
                        v-bind:key="key" 
                        v-on:click="onSort(key)"
                        :class="{ active: sortBy === key }">
                        {{key}}
                        <span class="arrow" :class="sortBy === key && sortDirection === 'desc' ? 'asc' : 'desc'"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="player in players" v-bind:key="player">
                    <td v-for="(value, key) in player" v-bind:key="key">
                    {{value}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="lastError">
      <span>{{ lastError }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as moment from 'moment';
const backendUrl = process.env.VUE_APP_BACKEND_URL;

export default {
  name: 'Players',
  props: {},
  data() {
    return {
      from: 1,
      limit: 5,
      sortBy: '',
      sortDirection: '',
      filter: '',
      players: [],
      hasMorePlayers: true,
      lastError: null,

    };
  },
  created() {
      this.onGetPlayers();
  },
  watch: {
    limit: function(newLimit) {
      if (/^[1-9]\d*$/.test(newLimit)) {
        this.limit = parseInt(newLimit);
      } else {
        this.limit = null;
      }
    }
  },
  computed: {
    enablePreviousPageButton: function() {
      return this.from !== 1;
    },
    enableNextPageButton: function() {
      return this.hasMorePlayers;
    },
  },
  methods: {
    buildParams() {
        const params = {
          from: this.from,
          limit: this.limit,
        };
        if (this.sortBy) params.sortBy = this.sortBy;
        if (this.sortDirection) params.sortDirection = this.sortDirection;
        if (this.filter) params.filter = this.filter;

        return params;
    },
      async onGetPlayers() {
        try {
          if (!this.from || !this.limit) {
            return;
          }
          const params = this.buildParams();
          const { data, headers } = await axios.get(`${backendUrl}/api/v1/players`, { params });

          this.hasMorePlayers = headers['x-has-more-players'] === 'true';
          this.players = data;
          this.lastError = null;
        } catch (e) {
          this.lastError = e.response.data.message;
        }
      },
      onSort(key) {
        this.sortDirection = this.sortBy === key && this.sortDirection === 'desc' ? 'asc' : 'desc';
        this.sortBy = key;
        this.onGetPlayers();
      },
      async onExport() {
        try {
          if (!this.from || !this.limit) {
            return;
          }
          const params = this.buildParams();
          const { data } = await axios.get(`${backendUrl}/api/v1/players/export`, { params, responseType: 'blob' });
          const fileUrl = window.URL.createObjectURL(new Blob([data]));
          const fileLink = document.createElement('a');

          fileLink.href = fileUrl;
          fileLink.setAttribute('download', `players-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`);
          document.body.appendChild(fileLink);
          fileLink.click();
        } catch (e) {
            this.lastError = e.response.data.message;
        }
      }
  }
};
</script>

<style scoped>
table {
  border: 2px solid #0000ff;
  border-radius: 2px;
  background-color: #fff;
}

th {
  background-color: #0000ff;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th, td {
  min-width: 10px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.desc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

input, button {
  margin-right: 5px;
}
</style>
