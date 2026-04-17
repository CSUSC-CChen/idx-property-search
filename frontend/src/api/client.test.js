import { fetchProperties, fetchPropertyDetail, fetchOpenHouses } from './client';

global.fetch = jest.fn();

describe('fetchProperties', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches properties successfully', async () => {
    const mockResponse = {
      total: 100,
      limit: 20,
      offset: 0,
      results: [
        {
          L_ListingID: '123',
          L_Address: '123 Main St',
          L_City: 'Los Angeles',
          L_State: 'CA',
          L_SystemPrice: 750000,
          L_Keyword2: 3,
          LM_Dec_3: 2,
          LM_Int2_3: 1500,
          Media: null
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const data = await fetchProperties({ limit: 20 });

    expect(fetch).toHaveBeenCalledWith('/api/properties?limit=20');
    expect(data).toEqual(mockResponse);
  });

  test('throws error on failed request', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(fetchProperties()).rejects.toThrow('HTTP 500');
  });

  test('builds query string correctly with multiple params', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await fetchProperties({ L_City: 'Los Angeles', minPrice: 500000, L_Keyword2: 3 });

    const callUrl = fetch.mock.calls[0][0];
    expect(callUrl).toContain('L_City=Los+Angeles');
    expect(callUrl).toContain('minPrice=500000');
    expect(callUrl).toContain('L_Keyword2=3');
  });

  test('calls /api/properties with no query string when no params', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], total: 0 })
    });

    await fetchProperties();
    expect(fetch).toHaveBeenCalledWith('/api/properties');
  });

  test('re-throws network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchProperties()).rejects.toThrow('Network error');
  });
});

describe('fetchPropertyDetail', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches a single property successfully', async () => {
    const mockProperty = { L_ListingID: 'ABC', L_Address: '1 Oak St' };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProperty });

    const data = await fetchPropertyDetail('ABC');
    expect(fetch).toHaveBeenCalledWith('/api/properties/ABC');
    expect(data).toEqual(mockProperty);
  });

  test('throws "Property not found" on 404', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found' });
    await expect(fetchPropertyDetail('MISSING')).rejects.toThrow('Property not found');
  });

  test('throws HTTP error message on non-404 failure', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Server Error' });
    await expect(fetchPropertyDetail('ABC')).rejects.toThrow('HTTP 500');
  });

  test('re-throws network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchPropertyDetail('ABC')).rejects.toThrow('Network error');
  });
});

describe('fetchOpenHouses', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches open houses successfully', async () => {
    const mockData = { openhouses: [{ OpenHouseDate: '2024-05-01' }] };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

    const data = await fetchOpenHouses('ABC');
    expect(fetch).toHaveBeenCalledWith('/api/properties/ABC/openhouses');
    expect(data).toEqual(mockData);
  });

  test('throws HTTP error message on failure', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Service Unavailable' });
    await expect(fetchOpenHouses('ABC')).rejects.toThrow('HTTP 503');
  });

  test('re-throws network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Connection refused'));
    await expect(fetchOpenHouses('ABC')).rejects.toThrow('Connection refused');
  });
});
